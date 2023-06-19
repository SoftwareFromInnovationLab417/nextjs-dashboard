import type { NextPage } from 'next'
import { AdminLayout } from '@layout'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';

const Home: NextPage = () => {
  const router = useRouter()
  return (
    <AdminLayout>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block"
            style={{ height: '73vh', width: '100vw' }}
            src="http://qny.chatea-lovely.top/school_match/2023/06/17/264abf13a1f444f9.png"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>赛事管理平台</h3>
            <p>唱跳rap</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </AdminLayout>
  )
}

export default Home
