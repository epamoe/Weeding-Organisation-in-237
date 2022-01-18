import React, { useState , useContext } from 'react' 
import Paragraphe from '../../elements/p/Paragraphe'
import Button from '../../elements/buttons/Button'
import WritePostModal from '../../utils/modals/WritePostModal'

import { BsEmojiHeartEyes, BsCardImage, BsCameraVideo }from 'react-icons/bs'
import currentUserContext from '../../../dataManager/context/currentUserContent'
import Subscriber from '../../../entities/Subscriber'

const WritePost = () => {
	const {currentUser} = useContext(currentUserContext)

	//state
	const [openPostModal, setOpenPostModal] = useState(false)
	const [showPreMessage, setShowPreMessage] = useState(true)

	//hamdler
	const handleCloseModal = () => {
		setOpenPostModal(false)
		
		let timer = setTimeout(setShowPreMessage(true), 5000)
		clearTimeout(timer)
	}

	const user = new Subscriber(currentUser)

	return(
		<>
			<div className="bg-white w-full flex flex-col space-y-4 mb-8 p-6 rounded" style={{border: "1px solid rgb(206, 206, 206)"}}>
				<div>
					<div>
						<span className="font-primary font-medium text-sm md:text-xl">
							Rédiger un article
						</span>
						<span className="block h-0.5 w-3/5 bg-black opacity-60 mt-1.5"></span>
					</div>
					<p 
						className="my-3 text-lg md:text-xl text-gray-500 font-medium cursor-pointer md:text-base text-sm font-primary"
						onClick={() => setOpenPostModal(true)}
						>
						votre message...
					</p>
				</div>
				<div className="flex justify-between items-center">
					<ul className="flex items-center space-x-6">
						<li>
							<BsEmojiHeartEyes 
								size="22" 
								color="#456445" 
								className="cursor-pointer text-gray-900"
								onClick={() => setOpenPostModal(true)} 
							/>
						</li>
						<li>
							<BsCardImage 
								size="25" 
								color="#456445" 
								className="cursor-pointer text-gray-900"
								onClick={() => setOpenPostModal(true)} 
							/>
						</li>
						<li>
							<BsCameraVideo 
								size="25" 
								color="#456445" 
								className="cursor-pointer text-gray-900"
								onClick={() => setOpenPostModal(true)} 
							/>
						</li>
					</ul>

					{
						user.getRole === 1 ? (
							<Button>
								Publier
							</Button>
						):(
							<Button>
								Proposer
							</Button>
						)
					}
				</div>
			</div>
        <WritePostModal
        	show={openPostModal}
        	onCloseModal={handleCloseModal}
        	showPreMessage={showPreMessage}
        	setShowPreMessage={setShowPreMessage}
        />
		</>
	)
}

export default WritePost