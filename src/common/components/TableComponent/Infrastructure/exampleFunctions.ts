import Service from '@/service/src';

export const onClick = async () =>{
    const signal = new AbortController().signal;

  const prueba = await Service.getCases(
    'getClients',        
    {
      signal,
      endPointData: {},   
      token: process.env.NEXT_PUBLIC_JWT,    
    }
  );

  return prueba;
}