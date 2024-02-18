import { auth, provider } from '../../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useGetUserInfo } from '../../hook/useGetUserInfo'

const Auth = ({ force }) => {
	const navigate = useNavigate()
	const { isAuth } = useGetUserInfo()
	//   console.log(force);

	const signInWithGoogle = async () => {
		const results = await signInWithPopup(auth, provider)
		const authInfo = {
			userID: results.user.uid,
			name: results.user.displayName,
			profilePhoto: results.user.photoURL,
			isAuth: true,
		}
		localStorage.setItem('auth', JSON.stringify(authInfo))
		navigate('/map')
	}

	const signUserOut = async () => {
		try {
			await signOut(auth)
			localStorage.clear()
			navigate('/')
		} catch {
			console.error(err)
		}
	}

	if (isAuth && force == false) {
		return (
			<>
				<button
					className="sign-out-button text-neutral-300 font-semibold hover:text-white  w-full rounded-2xl border border-[1.25] border-black py-2 px-6 hover:bg-neutral-300 border-neutral-300 duration-300 transition hover:drop-shadow-md"
					onClick={signUserOut}
				>
					Sign Out
				</button>
			</>
		)
	}

	return (
		<>
			<div className="login-button">
				<button
					className="login-with-google-btn font-semibold w-full text-black border border-2 rounded-2xl border-black hover:border-neutral-200 py-1 px-4 hover:bg-neutral-200 duration-300 transition "
					onClick={signInWithGoogle}
				>
					Sign In
				</button>
			</div>
		</>
	)
}

export default Auth
