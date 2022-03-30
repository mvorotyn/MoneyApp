import { Component } from 'react'

import '@/styles/animations.scss'
// interface IProps {
//     closeModal: string;
//     icon: any;//ForwardRefExoticComponent<P>;
//     style: any;
//   }

interface modalCompProps {
	isModalOpen: boolean
	closeModal(...args: unknown[]): unknown
	style?: {
		modal?: object
		overlay?: object
	}
}

class Modal extends Component<modalCompProps> {
	outerStyle: {}
	style: {
		modal?: object
		overlay?: object
	} = {}

	constructor(props: modalCompProps) {
		super(props)

		this.outerStyle = {
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			overflow: 'auto',
			zIndex: 1,
		}

		// default style
		this.style = {
			modal: {
				position: 'relative',
				width: '50%', //500px
				minWidth: '350px',
				padding: 20,
				boxSizing: 'border-box',
				backgroundColor: '#fff',
				margin: '40px auto',
				borderRadius: 3,
				zIndex: 2,
				textAlign: 'left',
				boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
				...props.style?.modal,
			},
			overlay: {
				position: 'fixed',
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(0,0,0,0.5)',
				...props.style?.overlay,
			},
		}
	}

	// render modal
	render() {
		return (
			<div
				style={{
					...this.outerStyle,
					display: this.props.isModalOpen ? 'block' : 'none',
				}}
			>
				<div style={this.style.overlay} onClick={this.props.closeModal} />
				<div onClick={this.props.closeModal} />
				<div
					style={this.style.modal}
					className={this.props.isModalOpen ? 'my-modal-reveal' : 'my-modal-hide'}
				>
					{this.props.children}
				</div>
			</div>
		)
	}
}

export default Modal

// https://mskelton.dev/ratchet
// Codemod to convert React PropTypes to TypeScript types.

// static propTypes = {
// 	isModalOpen: React.PropTypes.bool.isRequired,
// 	closeModal: React.PropTypes.func.isRequired,
// 	style: React.PropTypes.shape({
// 		modal: React.PropTypes.object,
// 		overlay: React.PropTypes.object
// 	})
// };
