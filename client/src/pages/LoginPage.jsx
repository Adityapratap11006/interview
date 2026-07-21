import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Input from '../components/auth/Input'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/auth/Button'
import Divider from '../components/auth/Divider'
import SocialButton from '../components/auth/SocialButton'
import FormText from '../components/auth/FormText'
import api from '../services/api'
import { AuthContext } from '../contexts/AuthContext'

const initialValues = {
  email: '',
  password: '',
  remember: true,
}

function validate(values) {
  const errors = {}

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

  return errors
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useContext(AuthContext)
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [serverMessage, setServerMessage] = useState(location.state?.success || '')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (event) => {
    const { value, checked, type } = event.target
    setValues((prev) => ({
      ...prev,
      [field]: type === 'checkbox' ? checked : value,
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
      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      })

      const { token, user } = response.data
      login(user, token, values.remember)

      navigate('/dashboard')
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to login. Please try again.'
      setServerMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to access your personalized prep dashboard and keep your study flow moving."
    >
      <div className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverMessage ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {serverMessage}
            </div>
          ) : null}

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
            placeholder="Enter your password"
            error={errors.password}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={values.remember}
                onChange={handleChange('remember')}
                className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
              />
              Remember me
            </label>
            <button type="button" className="text-sm text-cyan-300 transition hover:text-cyan-100">
              Forgot password?
            </button>
          </div>

          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <Divider text="Or continue with" />

        <SocialButton type="button">Continue with Google</SocialButton>

        <FormText className="text-center">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-100">
            Register
          </Link>
        </FormText>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
