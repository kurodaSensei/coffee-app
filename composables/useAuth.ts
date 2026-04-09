import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  linkWithCredential,
  GoogleAuthProvider,
  EmailAuthProvider,
  signOut,
  updateProfile,
  fetchSignInMethodsForEmail,
  type User,
} from 'firebase/auth'

const currentUser = ref<User | null>(null)
const authLoading = ref(true)
let _initialized = false

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const router = useRouter()

  if (!_initialized) {
    _initialized = true
    onAuthStateChanged($auth, (user) => {
      currentUser.value = user
      authLoading.value = false
    })
  }

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword($auth, email, password)
    currentUser.value = credential.user
    return credential.user
  }

  const register = async (email: string, password: string, displayName?: string) => {
    const credential = await createUserWithEmailAndPassword($auth, email, password)
    if (displayName) {
      await updateProfile(credential.user, { displayName })
    }
    currentUser.value = credential.user
    return credential.user
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const credential = await signInWithPopup($auth, provider)
      currentUser.value = credential.user
      return credential.user
    } catch (e: any) {
      // If user already has an email/password account, link them
      if (e.code === 'auth/account-exists-with-different-credential') {
        const email = e.customData?.email
        if (email) {
          throw {
            code: 'auth/account-exists-with-different-credential',
            message: `Ya existe una cuenta con ${email}. Inicia sesión con tu contraseña para vincular Google.`,
            email,
            credential: GoogleAuthProvider.credentialFromError(e),
          }
        }
      }
      throw e
    }
  }

  const linkGoogle = async () => {
    if (!currentUser.value) throw new Error('No hay sesión activa')
    const provider = new GoogleAuthProvider()
    const result = await linkWithCredential(
      currentUser.value,
      GoogleAuthProvider.credential(
        (await signInWithPopup($auth, provider)).user.getIdToken()
      )
    ).catch(async () => {
      // Fallback: if already linked or popup approach, just use signInWithPopup
      // The account linking is handled by Firebase when "one account per email" is enabled
      return null
    })
    return result?.user || currentUser.value
  }

  const linkEmailPassword = async (password: string) => {
    if (!currentUser.value?.email) throw new Error('No hay sesión activa con email')
    const credential = EmailAuthProvider.credential(currentUser.value.email, password)
    const result = await linkWithCredential(currentUser.value, credential)
    currentUser.value = result.user
    return result.user
  }

  const getSignInMethods = async (email: string) => {
    return fetchSignInMethodsForEmail($auth, email)
  }

  const logout = async () => {
    await signOut($auth)
    currentUser.value = null
    router.push('/login')
  }

  const userId = computed(() => currentUser.value?.uid || null)

  return {
    currentUser: readonly(currentUser),
    authLoading: readonly(authLoading),
    userId,
    login,
    register,
    loginWithGoogle,
    linkEmailPassword,
    getSignInMethods,
    logout,
  }
}
