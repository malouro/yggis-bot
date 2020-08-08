import React, { Component } from 'react'
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa'
import { MdMessage, MdEmail } from 'react-icons/md'
import styled from 'styled-components'
import config from '../../data/SiteConfig'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 100%;
`

const UserIcon = styled.a`
  margin-left: 25px;
  color: white;
  &:hover {
    color: rgba(0, 0, 0, 0.2);
    border-bottom: none;
  }
`

const iconStyle = {
	width: '20px',
	height: '20px'
}

const icons = {
	github: FaGithub,
	discord: FaDiscord,
	twitter: FaTwitter,
	messenger: MdMessage,
	email: MdEmail
}

class UserLinks extends Component {
	render() {
		return (
			<Container className="user-links">
				{config.userLinks.map((options) => {
					const Icon = icons[options.label.toLowerCase()]
					return (
						<UserIcon href={options.url}>
							<Icon style={iconStyle} />
						</UserIcon>
					)
				})}
			</Container>
		)
	}
}

export default UserLinks
