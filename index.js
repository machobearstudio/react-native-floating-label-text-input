import React, { Component } from 'react'

import {
  Text,
  View,
  TextInput,
  Animated
} from 'react-native'

class FloatingLabel extends Component {
  constructor(props) {
    super(props)

    let initialPadding = 9
    let initialOpacity = 0
    
    if (this.props.visible) {
      initialPadding = 5
      initialOpacity = 1
    }
    this.state = {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    }
  }

  componentWillReceiveProps(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? 5 : 9,
      duration: 230
    }).start()

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? 1 : 0,
      duration: 230
    }).start()
  }

  render() {
    return (
      <Animated.View style={[styles.floatingLabel, { paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim }]}>
        {this.props.children}
      </Animated.View>
    )
  }
}

class TextFieldHolder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      marginAnim: new Animated.Value(this.props.withValue ? 10 : 0)
    }
  }

  componentWillReceiveProps(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? 10 : 0,
      duration: 230
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
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <View
            style={{
              ...this.props.style,
              ...styles.fieldContainer,
              ...this.withBorder() }}
          >
            <FloatingLabel visible={String(this.state.text)}>
              <Text style={[styles.fieldLabel, this.labelStyle()]}>{this.placeholderValue()}</Text>
            </FloatingLabel>
            <TextFieldHolder withValue={String(this.state.text)}> 
              <TextInput
                {...this.props}
                value={String(this.props.value)}
                ref="input"
                style={styles.valueText}
                defaultValue={this.props.defaultValue}
                maxLength={this.props.maxLength}
                onFocus={() => this.setFocus()}
                onBlur={() => this.unsetFocus()}
              />
            </TextFieldHolder>
          </View>
        </View>
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
      return this.props.placeholder
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
    height: 45,
    justifyContent: 'center'
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  floatingLabel: {
    position: 'absolute',
    top: 0,
    left: 10
  },
  fieldLabel: {
    height: 15,
    fontSize: 9,
    color: '#B1B1B1'
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: '#C8C7CC',
  },
  valueText: {
    height: 50,
    fontSize: 16,
    color: '#111111'
  },
  focused: {
    color: '#1482fe'
  }
}

export default FloatLabelTextField
