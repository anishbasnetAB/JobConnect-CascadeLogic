// ================== SIGNUP ==================
exports.signup = async (req, res) => {
  const { name, age, country, email, password, userType } = req.body;
  const file = req.file;

  try {
    if (!userType || !['jobseeker', 'employer'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (userType === 'employer' && !file) {
      return res.status(400).json({ message: 'Company card image is required for employers' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      name,
      age,
      country,
      email,
      password: hashedPassword,
      userType,
      companyCard: userType === 'employer' ? file.filename : null,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Job Connect" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: 'Verify Your Email - Job Connect',
      html: `
        <h2>Hello ${newUser.name},</h2>
        <p>Thanks for signing up on <strong>Job Connect</strong>.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="color: #2b6cb0;">Verify Email</a>
        <p>This link will expire after first use.</p>
        <img src="../upload/logo.png" >
      `,
    });

    return res.status(201).json({
      message: 'User registered successfully. Verification link sent to email.',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
};