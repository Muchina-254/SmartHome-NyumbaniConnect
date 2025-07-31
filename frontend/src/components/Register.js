const handleRegister = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post("http://localhost:5000/api/register", formData);
        alert("✅ Registration successful!");
        console.log(res.data);

        // Optional: Clear form
        setFormData({
            name: "",
            email: "",
            password: "",
            role: ""
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        alert("❌ Registration failed. Please check your inputs.");
    }
};
