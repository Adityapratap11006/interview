import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Input from '../components/auth/Input'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/auth/Button'
import Divider from '../components/auth/Divider'
import SocialButton from '../components/auth/SocialButton'
import FormText from '../components/auth/FormText'
import api from '../services/api'

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function validate(values) {
  const errors = {}

  if (!values.name) {
    errors.name = 'Full name is required.'
  }

  if (!values.email) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

function RegisterPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverMessage, setServerMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (event) => {
    setValues((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerMessage('')

    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)

    try {
      await api.post('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      })

      navigate('/login', {
        state: { success: 'Account created successfully. Please sign in.' },
      })
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to register. Please try again.'
      setServerMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Register with PrepPilot to begin tracking your prep progress and personalized study recommendations."
    >
      <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverMessage ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {serverMessage}
            </div>
          ) : null}

          <Input
            label="Full name"
            value={values.name}
            onChange={handleChange('name')}
            placeholder="Your full name"
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            value={values.password}
            onChange={handleChange('password')}
            placeholder="Create a password"
            error={errors.password}
          />

          <PasswordInput
            label="Confirm password"
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
          />

          <Button type="submit" loading={loading}>
            Create account
          </Button>
        </form>

        <Divider text="Or sign up with" />

        <SocialButton type="button">Continue with Google</SocialButton>

        <FormText className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-100">
            Log in
          </Link>
        </FormText>
      </div>
    </AuthLayout>
  )
}

export default RegisterPage
