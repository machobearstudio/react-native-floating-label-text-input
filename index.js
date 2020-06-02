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
const LABEL_UPPER_OFFSET = 1
const VALUE_OFFSET = 10
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

  componentDidUpdate(prevProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: this.props.visible ? LABEL_UPPER_OFFSET : LABEL_LOWER_OFFSET,
      duration: ANIMATION_DURATION,
      useNativeDriver: false
    }).start()

    return Animated.timing(this.state.opacityAnim, {
      toValue: this.props.visible ? 1 : 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: false
    }).start()
  }

  render() {
    return (
      <Animated.View style={[styles.floatingLabel, { top: this.state.paddingAnim, opacity: this.state.opacityAnim }]}>
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

  componentDidUpdate(prevProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: this.props.withValue ? VALUE_OFFSET : 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: false
    }).start()
  }

  render() {
    return (
      <Animated.View style={[this.props.style, { paddingTop: this.state.marginAnim }]}>
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

  componentDidUpdate(prevProps) {
    if (this.props.hasOwnProperty('value') && this.props.value !== this.state.text) {
      this.setState({ text: this.props.value })
    }
  }

  withBorder() {
    if (this.props.withBorder) {
      return styles.withBorder
    }
  }

  render() {
    return (
      <TextFieldHolder withValue={this.state.text} style={[styles.container, this.props.style, this.withBorder()]}>
        <FloatingLabel visible={String(this.state.text)}>
          <Text style={[styles.fieldLabel, this.props.labelStyle, this.labelStyle()]}>{this.placeholderValue()}</Text>
        </FloatingLabel>
        <TextInput
          {...this.props}
          value={String(this.props.value)}
          ref="input"
          style={[styles.valueText, this.props.valueStyle]}
          defaultValue={this.props.defaultValue}
          maxLength={this.props.maxLength}
          onFocus={(e) => this.setFocus(e)}
          onBlur={(e) => this.unsetFocus(e)}
        />
      </TextFieldHolder>
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

  setFocus(e) {
    this.setState({
      focused: true
    })
    try {
      return this.props.onFocus(e)
    } catch (_error) { }
  }

  unsetFocus(e) {
    this.setState({
      focused: false
    })
    try {
      return this.props.onBlur(e)
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
    justifyContent: 'center'
  },
  floatingLabel: {
    zIndex: 2,
    position: 'absolute',
    left: 0
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
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: HORIZONTAL_PADDING,
    color: '#111111',
  },
  focused: {
    color: '#1482fe'
  }
}

export default FloatLabelTextField
