import React, { useState, useEffect, useRef } from "react"
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import useLoggedUser from '../../../custom-hooks/useLoggedUser'
import { API } from "../../../api/api-config"
import { Form, Formik } from "formik"
import Lottie from 'react-lottie'
import animationData from '../../../assets/lottie/error-dino.json'



const discordRefundRequest = async ({ name, phone, email }) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "username": name,
    "phone": phone,
    "email": email
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    let response = await fetch(`${API}/vortex/discord/refund`, requestOptions)

    let result = await response.json()


    return result


  } catch (error) {
    throw error
  }

}


const VortexError = ({
  message = "Didn't find an exact error message",
  onClick = () => { },
}) => {
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  const { getUser } = useLoggedUser()

  const { token, userId, email, name, address, photo, phone, messenger } = getUser()





  return (
    <Card sx={{ margin: "1em" }}>
      <CardContent>
        <Stack spacing={2} textAlign={"center"}>
          <Typography fontWeight={"bold"} fontSize={20} color={"gray"}>
            Oops!... something went wrong
          </Typography>
          <Lottie options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }}
            isClickToPauseDisabled={true}
            height={300}
            width={300}
            isStopped={false}
            isPaused={false} />
          <Typography variant="h6">{`We are now working very hard to fix this! you might wanna try again later`}</Typography>
          <Typography fontSize={10} color={"gray"} sx={{ overflow: "visible" }}>
            {message}
          </Typography>
          <Stack direction={"row"} justifyContent="space-around">

            <Button
              variant="contained"
              onClick={() => {
                setShow(true)
              }}
            >
              Send report and retry
            </Button>
          </Stack>
        </Stack>
        <Dialog open={show} onClose={handleClose} fullWidth>
          <DialogTitle>Our customer service team will check this and we will get back to you as soon as possible.</DialogTitle>
          <Formik
            initialValues={{ phone: phone, email: email, name: name }}
            onSubmit={async (data) => {
              try {
                await discordRefundRequest({
                  name: data.name,
                  phone: data.phone,
                  email: data.email
                })


                onClick()
              } catch (error) {
                throw error
              }
            }}>{({ handleChange, values, isSubmitting }) => {
              return <Form>
                <DialogContent>
                  <Stack>
                    <TextField name={"name"} label={"Name"} value={values.name} onChange={handleChange} disabled />
                    <TextField name={"email"} label={"My preferred email"} value={values.email} onChange={handleChange} />
                    <TextField name={"phone"} label={"My preffered mobile number"} value={values.phone} onChange={handleChange} />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button type={'submit'} disabled={isSubmitting}>{isSubmitting ? "Please wait..." : "Send report and retry"}</Button>
                </DialogActions>
              </Form>
            }}</Formik>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default VortexError
