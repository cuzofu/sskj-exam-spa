import React, {PureComponent, Fragment} from 'react';
import {
  Drawer,
  Radio,
  Checkbox,
} from 'antd';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class DetailDrawer extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderDescription = (otype, option) => {
    switch (otype) {
      case "文字":
        return <span>{option.description}</span>;
      case "图片":
        return (
          <Fragment>
            {option.description.map(i => (
              <img style={{width: 320, height: 240}} key={i.uid} src={i.response.url} />
            ))}
          </Fragment>
        );
      default:
        return null;
    }
  };

  renderOptions = (values) => {
    switch (values.qtype) {
      case "单选":
        return (
          <RadioGroup>
            {values.options.map(o => (
              <Radio
                key={o.key}
                value={o.description}
                style={{
                  display: 'block',
                  height: '30px',
                  lineHeight: '30px',
                }}
              >
                {this.renderDescription(values.otype, o)}
              </Radio>
            ))}
          </RadioGroup>
        );
      case "多选":
        return values.options.map(o => (
          <Checkbox
            key={o.key}
            style={{
              marginBottom: 12,
            }}
          >
            {this.renderDescription(values.otype, o)}
          </Checkbox>
        ));
      case "判断":
        break;
      default:
        return null;
    }
  };

  render() {
    const {visible, handleDetailDrawerVisible, values} = this.props;

    return (
      <Drawer
        title="题目预览"
        width={560}
        closable={false}
        onClose={(e) => handleDetailDrawerVisible(false, e)}
        visible={visible}
      >
        <h3>Q：{values.subject}</h3>
        {this.renderOptions(values)}
      </Drawer>
    );
  }
}

export default DetailDrawer;
