import { z } from 'zod'
import { ToastContainer, toast } from 'react-toastify';
import MapComponent from './components/MapComponent';
import axios from 'axios'
import { useState } from 'react'
import { FormRide, formSchema } from './components/FormRide'
import 'react-toastify/dist/ReactToastify.css';
import { DriverOption } from './components/DriverOption';
import { DriverOption as DriverOptionsAttr } from './types/api.estimate.response';
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import UnavaliableCarImg from './assets/unavaliableCar.png'

function App() {
  const [routeData, setRouteData] = useState<any>({})
  const [isShowDriversOptions, setIsShowDriversOptions] = useState<boolean>(false)
  const [isShowHistory, setIsShowHistory] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>()
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormValues(values)
    await axios.post(
      'http://localhost:8080/ride/estimate',
      values,
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then((response) => {
        setRouteData(response.data.response)
        setIsShowDriversOptions(true)
        console.log(response.data.response)
      }).catch(error => {
        toast.error(error.response.data.description, { theme: 'dark' })
      })
  }

  const handleConfirmRide = async (driver: { id: number; name: string }) => {
    if(formValues?.custumer_id){
      const ride = {
        customer_id: '', 
        origin: formValues.origin,
        destination: formValues.destination,
        distance: routeData.distance,
        duration: routeData.duration,
        driver,
        value: routeData.options[driver.id - 1].price
      }
      console.log(ride)
      await axios.patch("http://localhost:8080/ride/confirm", ride)
      .then( async (response) => {
        console.log(response.data)
        setIsShowDriversOptions(false)
        setRouteData({})
        setIsShowHistory(true)
        toast.success('Corrida confirmada com sucesso!', {theme: 'dark'})
      })
      .catch(error => {
        console.log(error)
        toast.error(error.response.data.description, { theme: 'dark' })
        returnToEstimate();
      })
    }else{
      toast.error('Os dados fornecidos no corpo da requisição são inválidos', { theme: 'dark' })
      returnToEstimate();
    }

  }

  const returnToEstimate = () => {
    setIsShowDriversOptions(false)
    setIsShowHistory(false)
    setRouteData({})
  }

  return (
    <div className='w-dvw h-dvh bg-slate-950 flex'>
      <ToastContainer />
      <section className='w-7/12 h-full opacity-90'>
        <MapComponent routeData={routeData.origin && routeData} />
      </section>
      <section className='w-5/12 h-full flex justify-evenly items-center flex-col'>
        {!isShowDriversOptions && !isShowHistory ? (
          <FormRide onSubmit={onSubmit} />
        )
          : isShowDriversOptions ?
            (
              <section className='overflow-y-hidden w-full h-full relative'>
                <header className='mb-5 h-10'>
                  <span onClick={returnToEstimate} className='text-slate-200 cursor-pointer absolute top-5 left-7 flex gap-2 items-center'>
                    <FaRegArrowAltCircleLeft size={30} />
                    Voltar
                  </span>
                </header>
                <main className='overflow-y-auto flex-col justify-around gap-3 flex items-center w-full h-full pb-20'>
                  {routeData.options.length > 0 ? 
                      routeData.options.map((driver: DriverOptionsAttr) => (
                        <DriverOption key={driver.id} driver={driver} estimateTimeSeconds={routeData.duration} confirmRide={handleConfirmRide} />
                      ))
                      :
                      (
                        <section className='flex-col space-y-2 flex items-center justify-center w-full h-full'>
                          <img className='w-72 h-72' src={UnavaliableCarImg} alt="" />
                          <h1 className='text-slate-600 text-center'>Nenhum motorista disponível, tente novamente</h1>
                        </section>
                      )
                  }
                  
                </main>
              </section>
            )
            :
            (
              isShowHistory && (
                <section className='overflow-y-hidden w-full h-full relative'>
                  <header className='mb-5 h-10'>
                    <span onClick={returnToEstimate} className='text-slate-200 cursor-pointer absolute top-5 left-7 flex gap-2 items-center'>
                      <FaRegArrowAltCircleLeft size={30} />
                      Voltar
                    </span>
                  </header>
                  <main className='overflow-y-auto flex-col justify-around gap-3 flex items-center w-full h-full pb-20'>
                    History
                  </main>
                </section>
              )
            )
        }
      </section>
    </div>
  )
}

export default App
