import React, { useState, useEffect } from 'react'
import Navbar1 from '../../../components/marketing/navbar/Navbar1'
import Loader from '../../../components/utils/Loader'
import signupImg from '../../../medias/img/signup-img.png'
import Post from '../../../components/marketing/pageSections/social/Post'

const BodySocial = () => {

	const [showLoader, setShowLoader] = useState(true)

	useEffect(() => {
		let timeout = setTimeout(() => setShowLoader(false), 1500)
		return () => {
			clearTimeout(timeout)
		}
	}, [])

	return(
		<>
		 <Navbar1 />
		 <Post />
		 { showLoader && <Loader /> }{/* vous pouvez aussi supprimer ce loader c'est juste la pour vous montrer qu'il est monte */}
		 
		</> 
	)
}

export default BodySocial