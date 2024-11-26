import { DriverOption as DriverOptionAttr } from "@/types/api.estimate.response"
import Homer from "@/assets/1.png"
import Toretto from "@/assets/2.png"
import Bond from "@/assets/3.png"

import StarRating from './StartRating';
import { useState } from "react";
import { Button } from "./ui/button";

type DriverOptionProps = {
    driver: DriverOptionAttr,
    estimateTimeSeconds: string,
    confirmRide: (selectedDriver: { id: number; name: string }) => void;
}

export const DriverOption = ({driver, estimateTimeSeconds, confirmRide}: DriverOptionProps) => {

    const estimateTime:number = Number(estimateTimeSeconds.replace('s', '')) / 60
    const [showDescription, setShowDescription] = useState<boolean>(false)
    function photoDriver() {
        switch(driver.id) {
            case 1:
                return Homer
            case 2:
                return Toretto
            case 3:
                return Bond
            default:
                return Homer
        }
    }

    const handleSelectDriver = () => {
        setShowDescription(!showDescription)
    }

    const handleConfirmRide = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        confirmRide({ id: driver.id, name: driver.name });
    }

    return (
        <>
            <div onClick={handleSelectDriver} className={`${showDescription ? 'border-slate-600' : 'border-transparent'} w-11/12 border-2 hover:border-slate-600 hover:border-2 cursor-pointer h-auto rounded-md flex flex-col justify-between items-center p-4 space-y-5`}>
                <main className="w-full h-auto flex justify-between items-center">
                    <div className='w-2/6 h-full flex flex-col justify-between items-center'>
                        <img className="w-28 h-28" src={photoDriver()} alt="" />
                        <div className="h-8 px-3 mt-[-5px] rounded-2xl border-slate-600 border-2 text-sm flex justify-center items-center text-slate-100">
                            {estimateTime.toFixed(0)} min
                        </div>
                    </div>
                    <div className='w-2/6 h-full flex flex-col justify-center gap-2 items-start'>
                        <h2 className='text-slate-200 text-lg font-bold'>{driver.name}</h2>
                        <p className='text-slate-500 text-sm'>{driver.car}</p>
                        <StarRating totalStars={Number(driver.rate)}/>
                    </div>
                    <div className='w-2/6 h-full gap-1 flex flex-col justify-center items-center'>
                        <p className='text-slate-200 text-3xl'>R$ {driver.price}</p>
                        <span className="text-xs text-center text-slate-700">Clique para ver mais</span>
                    </div>
                </main>
                {showDescription && (
                    <div className='w-full h-auto p-4 flex gap-14'>
                        <div className="flex-1 text-justify space-y-2">
                            <h1 className="text-base text-slate-200">Descrição:</h1>
                            <p className='text-slate-500 text-sm'>{driver.description}</p>
                        </div>
                        <div className="flex-1 text-justify space-y-2">
                            <h1 className="text-base text-slate-200">Avaliação:</h1>
                            <p className='text-slate-500 text-sm'>{driver.coments}</p>
                        </div>
                    </div>
                )}
                <Button onClick={handleConfirmRide} className='w-full z-10 active:bg-slate-600'>Escolher</Button>
            </div>
        </>
    )
}