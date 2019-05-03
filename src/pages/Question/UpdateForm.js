import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import debounce from 'lodash/debounce';
import Link from 'umi/link';
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Upload,
  Icon,
  message,
  Spin,
} from 'antd';
import OptionTableForm from './OptionTableForm';

const FormItem = Form.Item;
const {Option} = Select;

@Form.create({
  onValuesChange: (props, changedFields, allFields) => {
    const {handleUpdateValuesChange} = props;
    if (handleUpdateValuesChange) {
      console.log(changedFields);
      handleUpdateValuesChange(changedFields);
    }
  }
})
@connect(({question, loading}) => ({
  question,
  loadingTopicOptions: loading.effects['question/fetchTopicSelectorOptions'],
}))
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {
    },
    handleUpdateModalVisible: () => {
    },
    values: {},
  };

  constructor(props) {
    super(props);

    this.formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    this.handleTopicSearch = debounce(this.handleTopicSearch, 500);
  }

  handleOTypeSelect = (value) => {
    const {
      form: {
        getFieldValue,
        setFieldsValue,
      }
    } = this.props;
    const oldValue = getFieldValue('otype');
    if (oldValue === value) {
      return;
    }
    setFieldsValue({
      options: [],
    });
  };

  handleTopicSearch = (value) => {
    console.log(value);
    const {dispatch} = this.props;
    dispatch({
      type: 'question/fetchTopicSelectorOptions',
      payload: {
        topic: value,
      }
    });
  };

  handleTopicSelect = (value) => {
    const {
      form: {
        getFieldValue,
        setFieldsValue,
      }
    } = this.props;
    const oldValue = getFieldValue('topicKey');
    if (oldValue === value) {
      return;
    }
    const {
      question: {
        topicSelector = [],
      }
    } = this.props;
    const topic = topicSelector.filter(t => t.key === parseInt(value))[0].topic;
    setFieldsValue({
      topic,
    });
  };

  renderContent = (formValues) => {
    const { form, loadingTopicOptions, question: {topicSelector} } = this.props;

    return [
      form.getFieldDecorator('key', {
        initialValue: formValues.key,
      })(<Input key="key" type="hidden"/>),
      form.getFieldDecorator('topic', {
        initialValue: formValues.topic,
      })(<Input key="topic" type="hidden"/>),
      <FormItem key="topicKey" {...this.formLayout} label="课题">
        {form.getFieldDecorator('topicKey', {
          initialValue: formValues.topicKey,
          rules: [{required: true, message: '必填'}]
        })(
          <Select
            showSearch
            placeholder="输入课题名称搜索"
            style={{width: '100%'}}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleTopicSearch}
            onSelect={this.handleTopicSelect}
            notFoundContent={loadingTopicOptions ? <Spin size="small" /> : <Link to="/topic">没有课题？去新建。</Link>}
          >
            {topicSelector.map(o => (<Option key={o.key}>{o.topic}</Option>))}
          </Select>
        )}
      </FormItem>,
      <FormItem key="version" {...this.formLayout} label="版本号">
        {form.getFieldDecorator('version', {
          initialValue: formValues.version,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="qtype" {...this.formLayout} label="题型">
        {form.getFieldDecorator('qtype', {
          initialValue: formValues.qtype,
          rules: [{required: true, message: '必填'}]
        })(
          <Select style={{ width: '100%' }}>
            <Option value="单选">单选</Option>
            <Option value="多选">多选</Option>
            <Option value="判断">判断</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem key="otype" {...this.formLayout} label="选项类型">
        {form.getFieldDecorator('otype', {
          initialValue: formValues.otype,
          rules: [{required: true, message: '必填'}]
        })(
          <Select style={{ width: '100%' }} onSelect={this.handleOTypeSelect}>
            <Option value="文字">文字</Option>
            <Option value="图片">图片</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem key="subject" {...this.formLayout} label="题目">
        {form.getFieldDecorator('subject', {
          initialValue: formValues.subject,
          rules: [{required: true, message: '必填'}]
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="options" {...this.formLayout} label="选项">
        {form.getFieldDecorator('options', {
          initialValue: formValues.options || [],
        })(
          <OptionTableForm otype={formValues.otype} />
        )}
      </FormItem>
    ];
  };

  handleOk = () => {
    const {form, handleUpdate} = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (err) return;
      handleUpdate(fieldsValue);
    });
  };

  render() {
    const {visible, handleModalVisible, values} = this.props;

    return (
      <Modal
        width={840}
        bodyStyle={{ padding: '32px 40px 48px', height: window.innerHeight - 400, overflowY: 'auto' }}
        destroyOnClose
        title="修改题目"
        visible={visible}
        onCancel={() => handleModalVisible(false, values)}
        onOk={this.handleOk}
        okText="保存"
        afterClose={handleModalVisible}
      >
        {this.renderContent(values)}
      </Modal>
    );
  }
}

export default UpdateForm;
