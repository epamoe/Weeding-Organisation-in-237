import React from 'react'
import Body from './body/BodySocial'
import Seo from '../../components/utils/seo/Seo'
import Base from '../Base'


const Social = () => {
	return(
		<div className="">
			<Seo
				title="(10) Fil d'actualites|tundah"
				description="tundah est un réseau social qui met en avant la culture africaine pour la transmettre à la génération futur"
			/>
			<Base>
				<Body />
			</Base>
		</div>
	)
}

export default Social