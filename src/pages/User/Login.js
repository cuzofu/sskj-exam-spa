import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card, Alert, Checkbox, Icon, notification, message, Button } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import QRCode from 'qrcode-react';

const { Tab, UserName, Password, Submit, Mobile, Captcha } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    message: (
      <p style={{ margin: '50px auto' }}>
        二维码失效 <br /> 请点击刷新
      </p>
    ),
    qrcodeValue: '',
    value: '请使用App扫描二维码登录',
  };

  tick = () => {
    const { seconds } = this.state;
    if (seconds) {
      if (seconds === 0) {
        this.setState({
          type: 'qrcode',
          value: '二维码失效',
        });
      } else {
        this.props.dispatch({
          type: 'login/getQrcode',
          payload: {
            qrcode: this.state.qrcodeValue,
          },
          callback: status => {
            if (status) {
              if (status === '1') {
                this.setState({
                  value: '登录中，请稍后...',
                  seconds: seconds - 1,
                });
              } else {
                this.setState({
                  value: status,
                  seconds: seconds - 1,
                });
              }
            } else {
              this.setState({
                seconds: seconds - 1,
              });
            }
          },
        });
      }
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;
  }

  onTabChange = type => {
    this.setState({ type });
    if (type === 'qrcode') {
      this.interval = setInterval(() => this.tick(), 1000);
      let text = {};
      this.props.dispatch({
        type: 'login/getCreate',
        payload: {
          type: 'employee',
          operation: 'login',
          qrcode: '',
        },
        callback: data => {
          text = {
            type: data.type,
            operation: data.operation,
            qrcode: data.qrcode,
          };
          const json = JSON.stringify(text);
          this.setState({
            type: type,
            text: json,
            seconds: 120,
            qrcodeValue: data.qrcode,
          });
        },
      });
    } else {
      clearInterval(this.interval);
      this.setState({
        value: '请使用App扫描二维码登录',
      });
    }
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          message.error('手机号码有误');
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/sendVCode',
            payload: { phone: values.mobile },
            callback: success => {
              if (success) {
                resolve();
              } else {
                reject();
              }
            },
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  onClick = data => {
    return this.onTabChange(data);
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="account"
            tab={
              <span>
                <Icon type="user" />
                {formatMessage({ id: 'app.login.tab-login-credentials' })}
              </span>
            }
          >
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}

            <UserName name="username" placeholder="请输入用户名" />
            <Password
              name="password"
              placeholder="请输入账号密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <div style={{ float: 'left' }}>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                <FormattedMessage id="app.login.remember-me" />
              </Checkbox>
            </div>
          </Tab>
          <Tab
            key="mobile"
            tab={
              <span>
                <Icon type="phone" />
                {formatMessage({ id: 'app.login.tab-login-mobile' })}
              </span>
            }
          >
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}
            <Mobile
              name="mobile"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                },
              ]}
            />
            <Captcha
              name="code"
              placeholder="验证码"
              buttonText="验证码"
              countDown={30}
              onGetCaptcha={this.onGetCaptcha}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.verification-code.required' }),
                },
              ]}
            />
            <div style={{ height: '21px' }} />
          </Tab>
          <Tab
            key="qrcode"
            tab={
              <span>
                <Icon type="qrcode" />
                {formatMessage({ id: 'app.login.tab-login-qrcode' })}
              </span>
            }
          >
            <div style={{ height: '241.5px', position: 'relative' }}>
              <div className={styles.canvas}>
                <QRCode value={this.state.text} size={200} />
              </div>
              <div style={{ width: '100%', textAlign: 'center' }}>{this.state.value}</div>
              {this.state.seconds === 0 ? (
                <div onClick={() => this.onClick('qrcode')} className={styles.qrcode}>
                  {this.state.message}
                </div>
              ) : (
                ''
              )}
            </div>
          </Tab>

          {this.state.type === 'qrcode' ? (
            ''
          ) : (
            <Submit loading={submitting}>
              <FormattedMessage id="app.login.login" />
            </Submit>
          )}
            <div>
              <a
                style={{ float: 'right' }}
                href={`http://111.47.65.236:7777/group1/M00/88/29/oYYBAFxrUsWAAaeWAACKPGzUX-s03.docx`}
              >
                节后复工安全生产自查表
              </a>
              <a
                style={{ float: 'right', marginRight: '15px' }}
                href={`http://111.47.65.236:7777/group1/M00/3D/D1/oYYBAFx41maADgHzAB9-AMnK5Qw571.doc`}
              >
                操作说明
              </a>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
