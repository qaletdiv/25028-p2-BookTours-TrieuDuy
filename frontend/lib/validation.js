export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s/g, ""));
}

export function validateRegister({ fullName, email, phone, password, confirmPassword }) {
  const errors = {};

  if (!fullName?.trim()) errors.fullName = "Vui lòng nhập họ và tên";
  if (!email?.trim()) errors.email = "Vui lòng nhập email";
  else if (!isValidEmail(email)) errors.email = "Email không hợp lệ";
  if (!phone?.trim()) errors.phone = "Vui lòng nhập số điện thoại";
  else if (!isValidPhone(phone)) errors.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";
  if (!password) errors.password = "Vui lòng nhập mật khẩu";
  else if (password.length < 6) errors.password = "Mật khẩu tối thiểu 6 ký tự";
  if (password !== confirmPassword) errors.confirmPassword = "Mật khẩu không khớp";

  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email?.trim()) errors.email = "Vui lòng nhập email";
  else if (!isValidEmail(email)) errors.email = "Email không hợp lệ";
  if (!password) errors.password = "Vui lòng nhập mật khẩu";
  return errors;
}

export function validateCheckout({ contact, passengers, paymentMethod, card }) {
  const errors = {};

  if (!contact.fullName?.trim()) errors.contactFullName = "Vui lòng nhập họ tên";
  if (!contact.phone?.trim()) errors.contactPhone = "Vui lòng nhập số điện thoại";
  else if (!isValidPhone(contact.phone)) errors.contactPhone = "Số điện thoại không hợp lệ";
  if (!contact.email?.trim()) errors.contactEmail = "Vui lòng nhập email";
  else if (!isValidEmail(contact.email)) errors.contactEmail = "Email không hợp lệ";
  if (!contact.address?.trim()) errors.contactAddress = "Vui lòng nhập địa chỉ";

  const passengerErrors = passengers.map((p) => {
    const pe = {};
    if (!p.fullName?.trim()) pe.fullName = "Vui lòng nhập họ tên";
    if (p.phone && !isValidPhone(p.phone)) pe.phone = "SĐT không hợp lệ";
    return pe;
  });

  if (passengerErrors.some((pe) => Object.keys(pe).length > 0)) {
    errors.passengers = passengerErrors;
  }

  if (paymentMethod === "card") {
    const cardErrors = {};
    const digits = card.number?.replace(/\s/g, "") || "";
    if (!/^\d{16}$/.test(digits)) cardErrors.number = "Số thẻ phải có 16 chữ số";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry || "")) cardErrors.expiry = "Định dạng MM/YY";
    if (!/^\d{3,4}$/.test(card.cvv || "")) cardErrors.cvv = "CVV phải có 3-4 chữ số";
    if (!card.name?.trim()) cardErrors.name = "Vui lòng nhập tên trên thẻ";
    if (Object.keys(cardErrors).length > 0) errors.card = cardErrors;
  }

  return errors;
}
