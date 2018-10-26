import React from 'react';
import Backdrop from '../Backdrop/Backdrop'
import Aux from '../../hoc/Aux/Aux'
import styles from './Modal.module.css'

const modal = (props) => (
<Aux>
    <Backdrop show = {props.show} />
    <div className={styles['modal']}
        style={{
            transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.show ? '1' : '0'
        }}>{props.children}
    </div>
    </Aux>
);

export default modal;