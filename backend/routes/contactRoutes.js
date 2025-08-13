const express = require('express');
const Contact = require('../models/Contact');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/contact - Submit contact form (public route)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Create new contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim() : '',
      message: message.trim()
    });

    await contact.save();

    console.log(`📧 New contact message from ${email}:`, {
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      messagePreview: contact.message.substring(0, 100) + (contact.message.length > 100 ? '...' : ''),
      id: contact._id
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: {
        id: contact._id,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// GET /api/contact/stats/summary - Get contact statistics (admin only)
router.get('/stats/summary', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ isRead: false });
    const todayMessages = await Contact.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const statusStats = {};
    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        total: totalMessages,
        unread: unreadMessages,
        today: todayMessages,
        statusBreakdown: {
          new: statusStats.new || 0,
          read: statusStats.read || 0,
          replied: statusStats.replied || 0,
          resolved: statusStats.resolved || 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching contact statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact statistics'
    });
  }
});

// GET /api/contact - Get all contact messages (admin only)
router.get('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { status, isRead, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get contacts with pagination
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-adminNotes'); // Don't include admin notes in list view

    // Get total count for pagination
    const totalContacts = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalContacts / parseInt(limit));

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalContacts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('❌ Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// GET /api/contact/:id - Get specific contact message (admin only)
router.get('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read if it wasn't already
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('❌ Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    });
  }
});

// PATCH /api/contact/:id/status - Update contact message status (admin only)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { status, adminNotes } = req.body;
    
    const validStatuses = ['new', 'read', 'replied', 'resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Update fields
    if (status) contact.status = status;
    if (adminNotes !== undefined) contact.adminNotes = adminNotes;
    
    await contact.save();

    console.log(`📝 Contact message ${contact._id} updated by admin:`, {
      newStatus: contact.status,
      hasNotes: !!contact.adminNotes
    });

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: contact
    });

  } catch (error) {
    console.error('❌ Error updating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message'
    });
  }
});

// DELETE /api/contact/:id - Delete contact message (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    console.log(`🗑️ Contact message deleted by admin:`, {
      id: contact._id,
      email: contact.email
    });

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message'
    });
  }
});

module.exports = router;
