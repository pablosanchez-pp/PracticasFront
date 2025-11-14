'use client'

// import Service from "@/service/src"
import { FC } from "react"
import { TableComponentProps } from "./interface"
import Hola from './components/Hola';

const TableComponent:FC = () => {

    // const signal = new AbortController().signal;

    // const llamada = Service.getCases('getComerces',{
    //     signal:signal,
    //     endPointData:{id:'1234'},
    //     token:'ey....'
    //     }
    // ).then(res=>{
    //     console.log(res);
        
    // })

    //const columns = []


    return (
    <div>
      <Hola />
    </div>
  );
};

export default TableComponent;