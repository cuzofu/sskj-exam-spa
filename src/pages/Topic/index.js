import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Divider,
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';

import styles from './Topic.less';

const FormItem = Form.Item;
const {Option} = Select;

@connect(({topic, loading}) => ({
  topic,
  loading: loading.models.topic,
}))
@Form.create()
class Topic extends Component {
  state = {
    createModalVisible: false,
    updateModalVisible: false,
    queryValues: {},
    selectedRows: [],
    updateValues: {},
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'topic/fetch',
      payload: {},
    });
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'topic/clear',
    });
  }

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      queryValues: {},
    });
    dispatch({
      type: 'topic/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        queryValues: values,
      });

      dispatch({
        type: 'topic/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="课题名称">
              {getFieldDecorator('topic')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="课题名称">
              {getFieldDecorator('topic')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="大类">
              {getFieldDecorator('category')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="大类一">大类一</Option>
                  <Option value="大类二">大类二</Option>
                  <Option value="大类三">大类三</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="小类">
              {getFieldDecorator('subcategory')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="小类一">小类一</Option>
                  <Option value="小类二">小类二</Option>
                  <Option value="小类三">小类三</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="课件类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="video">视频</Option>
                  <Option value="audio">音频</Option>
                  <Option value="ppt">PPT</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{overflow: 'hidden'}}>
              <div style={{marginBottom: 24}}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                  重置
                </Button>
                <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                  收起 <Icon type="up"/>
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const {expandForm} = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {queryValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...queryValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'topic/fetch',
      payload: params,
    });
  };

  handleCreateModalVisible = flag => {
    this.setState({
      createModalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateValues: record || {},
    });
  };

  handleAdd = (values) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'topic/add',
      payload: values,
    });

    message.success('添加成功');
    this.handleCreateModalVisible();
  };

  handleUpdateValuesChange = changedFields => {
    const {updateValues} = this.state;
    this.setState({
      updateValues: {
        ...updateValues,
        ...changedFields,
      }
    });
  };

  handleUpdate = (values) => {
    const {dispatch} = this.props;
    const {queryValues} = this.state;
    dispatch({
      type: 'topic/update',
      payload: {
        query: queryValues,
        body: values,
      },
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
  };

  handleDelete = (key) => {
    const {dispatch} = this.props;
    const {queryValues} = this.state;
    dispatch({
      type: 'topic/remove',
      payload: {
        query: queryValues,
        body: {key,},
      },
    });

    message.success('删除成功');
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'topic/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  render() {
    const {
      loading,
      topic: {data},
    } = this.props;
    const {selectedRows, createModalVisible, updateModalVisible, updateValues} = this.state;
    console.log(updateValues);
    const createMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleCreateModalVisible,
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      handleUpdateValuesChange: this.handleUpdateValuesChange,
    };

    const columns = [
      {
        title: '课题',
        dataIndex: 'topic',
      },
      {
        title: '版本号',
        dataIndex: 'version',
      },
      {
        title: '大类',
        dataIndex: 'category',
      },
      {
        title: '小类',
        dataIndex: 'subcategory',
      },
      {
        title: '课件类型',
        dataIndex: 'type',
      },
      {
        title: '描述',
        dataIndex: 'description',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleDelete(record.key)}>删除</a>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreateModalVisible(true)}>
                新建
              </Button>
              <Button onClick={() => router.push('/question')}>
                题库
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      批量操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...createMethods} visible={createModalVisible}/>
        <UpdateForm {...updateMethods} visible={updateModalVisible} values={updateValues}/>
      </PageHeaderWrapper>
    );
  }
}

export default Topic;
