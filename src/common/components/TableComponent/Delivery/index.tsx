'use client'

// import Service from "@/service/src"
import { FC } from "react"
import { TableComponentProps } from "./interface"

const TableComponent:FC<TableComponentProps> = ({data}) => {

    // const signal = new AbortController().signal;

    // const llamada = Service.getCases('getComerces',{
    //     signal:signal,
    //     endPointData:{id:'1234'},
    //     token:'ey....'
    //     }
    // ).then(res=>{
    //     console.log(res);
        
    // })

    const columns = []


    return <div>
        <Table/>
    </div>
}

export default TableComponent