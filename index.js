import React, { Component } from 'react'

import {
  Text,
  View,
  TextInput,
  Animated,
  Platform
} from 'react-native'

const HORIZONTAL_PADDING = 12
const LABEL_LOWER_OFFSET = 12
const LABEL_UPPER_OFFSET = 17
const VALUE_OFFSET = 15
const ANIMATION_DURATION = 230

class FloatingLabel extends Component {
  constructor(props) {
    super(props)

    let initialPadding = LABEL_LOWER_OFFSET
    let initialOpacity = 0
    
    if (this.props.visible) {
      initialPadding = LABEL_UPPER_OFFSET
      initialOpacity = 1
    }
    this.state = {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    }
  }

  componentWillReceiveProps(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? LABEL_UPPER_OFFSET : LABEL_LOWER_OFFSET,
      duration: ANIMATION_DURATION
    }).start()

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? 1 : 0,
      duration: ANIMATION_DURATION
    }).start()
  }

  render() {
    return (
      <Animated.View style={[styles.floatingLabel, { paddingBottom: this.state.paddingAnim, opacity: this.state.opacityAnim }]}>
        {this.props.children}
      </Animated.View>
    )
  }
}

class TextFieldHolder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      marginAnim: new Animated.Value(this.props.withValue ? VALUE_OFFSET : 0)
    }
  }

  componentWillReceiveProps(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? VALUE_OFFSET : 0,
      duration: ANIMATION_DURATION
    }).start()
  }

  render() {
    return (
      <Animated.View style={{ marginTop: this.state.marginAnim }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

class FloatLabelTextField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      text: this.props.value
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.hasOwnProperty('value') && newProps.value !== this.state.text) {
      this.setState({ text: newProps.value })
    }
  }

  withBorder() {
    if (this.props.withBorder) {
      return styles.withBorder
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style, this.withBorder()]}>
        <FloatingLabel visible={String(this.state.text)}>
          <Text style={[styles.fieldLabel, this.props.labelStyle, this.labelStyle()]}>{this.placeholderValue()}</Text>
        </FloatingLabel>
        <TextFieldHolder withValue={String(this.state.text)}> 
          <TextInput
            {...this.props}
            value={String(this.props.value)}
            ref="input"
            style={[styles.valueText, this.props.valueStyle]}
            defaultValue={this.props.defaultValue}
            maxLength={this.props.maxLength}
            onFocus={() => this.setFocus()}
            onBlur={() => this.unsetFocus()}
          />
        </TextFieldHolder>
      </View>
    )
  }

  inputRef() {
    return this.refs.input
  }

  focus() {
    this.inputRef().focus()
  }

  blur() {
    this.inputRef().blur()
  }

  isFocused() {
    return this.inputRef().isFocused()
  }

  clear() {
    this.inputRef().clear()
  }

  setFocus() {
    this.setState({
      focused: true
    })
    try {
      return this.props.onFocus()
    } catch (_error) { }
  }

  unsetFocus() {
    this.setState({
      focused: false
    })
    try {
      return this.props.onBlur()
    } catch (_error) { }
  }

  labelStyle() {
    if (this.state.focused) {
      return styles.focused
    }
  }

  placeholderValue() {
    if (String(this.state.text)) {
      return this.props.label
    }
  }

  setText(value) {
    this.setState({
      text: value
    })
    try {
      return this.props.onChangeTextValue(value)
    } catch (_error) { }
  }
}

const styles = {
  container: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: HORIZONTAL_PADDING
  },
  floatingLabel: {
    position: 'absolute',
    left: HORIZONTAL_PADDING
  },
  fieldLabel: {
    height: 15,
    fontSize: 11,
    color: '#111111'
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: '#C8C7CC',
  },
  valueText: {
    fontSize: 16,
    color: '#111111',
  },
  focused: {
    color: '#1482fe'
  }
}

export default FloatLabelTextField
