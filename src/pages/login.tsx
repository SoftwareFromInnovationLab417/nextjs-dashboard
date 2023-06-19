import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import {
  Button, Col, Container, Form, InputGroup, Row,
} from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import { Dispatch, SetStateAction, SyntheticEvent, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import axiosInstance from 'src/axiosInstance'
import OffCanvas from '@components/offCanvas';
import { GlobalContext, GlobalData } from 'src/globalData'
import { API } from '@models/api'
import { TIMEOUT } from 'dns'

const Login: NextPage = () => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { globalData, setGlobalData } = useContext(GlobalContext)

  const [visit, setVisit] = useState(false)
  const [visitMsg, setVisitMsg] = useState('')

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const [show, setShow] = useState(false);

  const getRedirect = () => {
    const redirect = getCookie('redirect')
    if (redirect) {
      deleteCookie('redirect')
      return redirect.toString()
    }

    return '/menu/introduction'
  }

  const login = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()

    setSubmitting(true)

    const res: API = await axiosInstance.get('/login', {
      // const res: AxiosResponse<{ code: number, msg: string, data: any }> = await axiosInstance.get('/test/login?i=1', {
      params: {
        username,
        password,
      },
    })
    const { code, msg, data } = res
    if (code === 200) {
      // setVisit(false)
      setGlobalData({ identity: data.identity, token: data.token, id: data.id }),
        setCookie('auth', data.token)
      console.log(data.token)
      router.push(getRedirect())
    } else {
      setVisit(true)
      setVisitMsg(res.data && res.data.msg ? res.data.msg : "error")
    }
    setSubmitting(false)
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>
        <Row className="justify-content-center align-items-center px-3">
          <Col lg={8}>
            <Col md={9} className="bg-white border p-5">
              <div className="">
                <h1>登陆</h1>
                <p className="text-black-50">输入你的账号</p>

                <form onSubmit={login}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon
                        icon={faUser}
                        fixedWidth
                      />
                    </InputGroup.Text>
                    <Form.Control
                      name="username"
                      required
                      disabled={submitting}
                      placeholder="账号"
                      aria-label="Username"
                      defaultValue="Username"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FontAwesomeIcon
                        icon={faLock}
                        fixedWidth
                      />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      required
                      disabled={submitting}
                      placeholder="密码"
                      aria-label="Password"
                      defaultValue="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>

                  <Row>
                    <Col xs={6}>
                      <Button className="px-4" variant="primary" type="submit" disabled={submitting}>Login</Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
            {visit &&
              <Alert variant="danger" style={{ width: "40vw", margin: "10px 0" }}>
                {visitMsg}
              </Alert>
            }

            {['top'].map((name, idx) => (
              <OffCanvas key={idx} show={show} name={name} onHide={setShow} placement='top'>
                <p>Hello World</p>
              </OffCanvas>
            ))}
            <Button onClick={() => setShow(!show)}>click</Button>
          </Col>
        </Row>
      </Container>
    </div >
  )
}

export default Login


