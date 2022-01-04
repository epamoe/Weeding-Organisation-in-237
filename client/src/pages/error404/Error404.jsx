import React from 'react'
import Body from './body/BodyError404'
import Seo from '../../components/utils/seo/Seo'
import Base from '../Base'


const Social = () => {
	return(
		<div className="">
			<Seo
				title="page introuvable | tundah"
				description="tundah est un réseau social qui met en avant la culture africaine pour la transmettre à la génération futur"
			/>
			<Base>
				<Body />
			</Base>
		</div>
	)
}

export default Social