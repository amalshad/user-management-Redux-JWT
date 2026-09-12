export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    errors.name = "Name can only contain alphabetic characters and spaces";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    errors.password = "Password must contain at least one letter and one number";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Please fill the required fields",
      errors
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Please fill the required fields",
      errors
    });
  }

  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { name, email } = req.body;
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Name is required";
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    errors.name = "Name can only contain alphabetic characters and spaces";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Please fill the required feilds",
      errors
    });
  }

  next();
};
