import React from 'react'
import { Input } from 'antd';
import './ComboName.css'
import PropTypes from 'prop-types'

function ComboName(props) {
    const {state} = props;
    return (
        <div className="nameContainer">
            <Input className="comboInput" placeholder="Enter combo name" />
        </div>
    )
}

ComboName.propTypes = {

}

export default ComboName

