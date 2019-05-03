import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Upload,
  Icon,
  message,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    handleAdd: () => {},
    handleAddModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formValues: {
        category: '大类一',
        subcategory: '小类一',
        type: 'video',
        file: [],
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  renderContent = (formValues) => {
    const { form } = this.props;

    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: (info) => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return [
      <FormItem key="topic" {...this.formLayout} label="课题">
        {form.getFieldDecorator('topic', {
          rules: [{required: true, message: '必填'}]
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="version" {...this.formLayout} label="版本号">
        {form.getFieldDecorator('version', {
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="category" {...this.formLayout} label="大类">
        {form.getFieldDecorator('category', {
          initialValue: formValues.category,
        })(
          <Select style={{ width: '100%' }}>
            <Option value="大类一">大类一</Option>
            <Option value="大类二">大类二</Option>
            <Option value="大类三">大类三</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem key="subcategory" {...this.formLayout} label="子类">
        {form.getFieldDecorator('subcategory', {
          initialValue: formValues.subcategory,
        })(
          <Select style={{ width: '100%' }}>
            <Option value="子类一">子类一</Option>
            <Option value="子类二">子类二</Option>
            <Option value="子类三">子类三</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem key="type" {...this.formLayout} label="课件类型">
        {form.getFieldDecorator('type', {
          initialValue: 'video',
        })(
          <Select style={{ width: '100%' }}>
            <Option value="video">视频</Option>
            <Option value="audio">音频</Option>
            <Option value="ppt">PPT</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem key="description" {...this.formLayout} label="描述">
        {form.getFieldDecorator('description', {
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="file" {...this.formLayout} label="文件">
        {form.getFieldDecorator('file', {
          initialValue: formValues.file,
          valuePropName: 'fileList',
          getValueFromEvent: (e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          },
        })(
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        )}
      </FormItem>
    ];
  };

  handleOk = () => {
    const { form, handleAdd } = this.props;
    const { formValues: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };

  render() {
    const { visible, handleModalVisible, values } = this.props;
    const { formValues } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="新增课题"
        visible={visible}
        onCancel={() => handleModalVisible(false, values)}
        onOk={this.handleOk}
        okText="保存"
        afterClose={handleModalVisible}
      >
        {this.renderContent(formValues)}
      </Modal>
    );
  }
}

export default CreateForm;
