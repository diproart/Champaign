// @flow
import React, { Component } from 'react';
import SweetInput from '../SweetInput/SweetInput';
import SelectCountry from '../SelectCountry';
import SweetSelect from '../SweetSelect/SweetSelect';

type Field = {
  data_type: string;
  name: string;
  label: string;
  default_value?: string;
  required?: boolean;
  disabled?: boolean;
};

export default class FieldShape extends Component {
  props: {
    field: Field;
    value?: any;
    errorMessage?: string;
    onChange?: (v: ?SyntheticEvent | ?string) => void;
  };

  fieldProps() {
    const { field, value } = this.props;
    return {
      name: field.name,
      label: field.label,
      disabled: field.disabled,
      required: field.required,
      value: value,
      errorMessage: this.props.errorMessage,
      onChange: this.props.onChange,
    };
  }

  renderField(type: string): React$Element<any> {
    const fieldProps = this.fieldProps();
    const { field: { default_value, name } } = this.props;

    switch (type) {
      case 'email':
        return <SweetInput type="email" {...fieldProps} />;
      case 'phone':
      case 'numeric':
        return <SweetInput type="tel" {...fieldProps} />;
      case 'country':
        return <SelectCountry {...fieldProps} />;
      case 'dropdown':
      case 'select':
        return <SweetSelect {...fieldProps} options={this.props.field.choices} />;
      case 'hidden':
        return <input type="hidden" name={name} value={default_value} />;
      case 'checkbox':
      case 'choice':
        return <p>{type} pending implementation</p>;
      case 'instruction':
        return <div className="form__instruction">{ fieldProps.label }</div>;
      case 'text':
      case 'postal':
      default:
        return <SweetInput type="text" {...fieldProps} />;
    }
  }

  render() {
    return (
      <div key={this.props.field.name} className="MemberDetailsForm-field form__group action-form__field-container">
        {this.renderField(this.props.field.data_type)}
      </div>
    );
  }
}
