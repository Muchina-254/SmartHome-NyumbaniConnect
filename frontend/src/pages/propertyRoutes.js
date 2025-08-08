router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      image: req.file ? req.file.filename : ''
    });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post property' });
  }
});
