import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const countries = {
  IN: { phoneCode: '+91', timezones: ['Asia/Kolkata'] },
  AU: { phoneCode: '+61', timezones: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth']},
  US: { phoneCode: '+1', timezones: ['America/New_York', 'America/Los_Angeles', 'America/Chicago']},
  // Add other countries and their timezones here
};

const Auth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'IN',
    timezone: 'Asia/Kolkata',
    telegramId: '',
  });
  const [phoneCode, setPhoneCode] = useState('+91');
  const [timezones, setTimezones] = useState(['Asia/Kolkata']);

  useEffect(() => {
    const country = formData.country;
    if (countries[country]) {
      setPhoneCode(countries[country].phoneCode);
      setTimezones(countries[country].timezones);
      if (!countries[country].timezones.includes(formData.timezone)) {
        setFormData({ ...formData, timezone: countries[country].timezones[0] });
      }
    }
  }, [formData.country]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Prepare data in x-www-form-urlencoded format
    const formDataEncoded = new URLSearchParams({
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        country: formData.country,
        timezone: formData.timezone,
        telegramId: formData.telegramId,
    }).toString();

    try {
        const response = await axios.post(
            'https://flexshark.app/FlexServer/register',
            formDataEncoded,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

        alert('Signup successful!');
        console.log('Signup data:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error);
        alert('An error occurred during signup.');
    }
};


  const handleLogin = async (e) => {
    e.preventDefault();
    const authString = `${formData.username}:${formData.password}`;
    const encodedAuthString = btoa(authString);

    try {
        const response = await axios.post(
            'https://flexshark.app/FlexServer/auth',
            {}, // Empty body as credentials are passed in headers
            {
                headers: {
                    'Authorization': `Basic ${encodedAuthString}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200) {
            alert('Login successful!');
            console.log('Login data:', response.data);
            // You can store the access token in localStorage or state
            const accessToken = response.data.access_token;
            console.log('Access Token:', accessToken);
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error);
        alert('Invalid credentials or an error occurred during login.');
    }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-700 via-blue-800 to-blue-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className='text-center pb-10 text-blue-600'>FlexShark</h1>
        <div className="flex justify-between mb-4">
          <button
            className={`py-2 px-4 rounded ${isSignup ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsSignup(true)}
          >
            Signup
          </button>
          <button
            className={`py-2 px-4 rounded ${!isSignup ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
        </div>

        {isSignup ? (
          <form onSubmit={handleSignup}>
            <label className="font-semibold text-black">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 mb-4 mt-2 border rounded"
              required
            />
            <label className="font-semibold text-black">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <label className="font-semibold text-black">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <label className="font-semibold text-black">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <label className="font-semibold text-black">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            >
              {Object.keys(countries).map((countryCode) => (
                <option key={countryCode} value={countryCode}>
                  {countryCode}
                </option>
              ))}
            </select>
            <label className="font-semibold text-black">Timezone</label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <label className="font-semibold text-black">Telegram ID</label>
            <input
              type="text"
              name="telegramId"
              placeholder="Telegram ID"
              value={formData.telegramId}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded">
              Signup
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <label className="font-semibold text-black">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <label className="font-semibold text-black">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded">
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
