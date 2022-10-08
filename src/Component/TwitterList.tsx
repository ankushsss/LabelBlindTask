import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Table, TableRow, TableCell, TableBody, TableContainer, TableHead, Avatar, Button, TextField} from '@mui/material'
import { type } from '@testing-library/user-event/dist/type'


// import makeStyles from '@emotion/styled'
type twittList = {
    author:string
    _id:string
    url:string
    likes:number
    imageUrl:string
    
}
type res = {
    data: []
}

// interface Obj
// { 
//         "_id": String,
//         "url": String,
//         "text": String,
//         "author": String,
//         "publishedDate": String,
//         "publishedTimestamp": {
//             "$numberLong": String
//         },
//         "scrapedTimestamp": {
//             "$numberLong": String
//         },
//         "retweets": Number,
//         "likes": Number,
//         "postTimestamp": {
//             "$numberLong": Number
//         },
//         "requestTimestamp": {
//             "$numberLong": Number
//         },
//         "sentiment": String,
//         "hashtags": String,
//         "isRetweet": Boolean,
//         "rankurDataImport": Boolean
//     }



export const TwitterList = () => {
    const [twittList, setTweetList] = useState<twittList[]>([])
    const [searchDate, setSearchedDate] = useState<twittList[]>([])

    const [localStore, setLocalStore] = useState<twittList[]>([]);

    //   const classes = useStyles();



    useEffect(() => {
        getData()
       let store:any =localStorage.getItem("store")
        let storeParse = JSON.parse(store)
        console.log(storeParse)
        setLocalStore(storeParse)

    }, [])
    const searchUser = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let filter:Array<twittList> = []
     twittList.map((matching:twittList)=>{
        let key = matching._id
        if(matching.author.search(e.target.value) != -1)
        {
          filter.push(matching)
        }
        // return matching.author.match(e.target.value) 
     })

        console.log(filter)
        if(e.target.value != "")
        {
        setTweetList(filter)

        }
        else{
            getData()
        }
        
    }

    const filterByDate = (e:React.ChangeEvent<HTMLInputElement>)=>{
        let filter:Array<twittList> = []
        

        let filterData =  searchDate.map((matching:any)=>{
            let val = new Date(e.target.value).toString()
            let lengthStr = matching.publishedDate.length
            let date = new Date(matching.publishedDate).toString()
            console.log(date.slice(0,15) == val.slice(0,15))
           if(date.slice(0,15) == val.slice(0,15))
           {
             filter.push(matching)
           }


           // return matching.author.match(e.target.value) 
        })
        if(e.target.value != "")
        {
        setTweetList(filter)
        

        }
        else{
            getData()
        }
    }

    async function setInLocalStorege(like:any){
        if(localStore.length == 0){
            setLocalStore(like)
        }
        setLocalStore([...localStore,like]) 
        localStorage.setItem("store", JSON.stringify(localStore));
      
    }


    const getData = async () => {
        try {
            const res: res = await axios("http://www.mocky.io/v2/5d1ef97d310000552febe99d")
            console.log(res)
            setTweetList(res.data)
            setSearchedDate(res.data)
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <TextField placeholder='search' onChange={searchUser}/>
            <TextField type="date" onChange={filterByDate}/>
            <Button variant='contained' onClick={()=>  {
                localStorage.setItem("store", JSON.stringify([]))
                setLocalStore([])
                }}>Clear Local Storage</Button>
                            <TableContainer>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Author</TableCell>
                                            <TableCell align="left">Link</TableCell>
                                            <TableCell align="left">Like</TableCell>
                                            <TableCell align="left">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        twittList.map((twitt:any) => {
                                            let isTrue
                                            localStore.map((compair:any)=>{
                                                if(twitt._id == compair._id)
                                                {
                                                    isTrue = true
                                                }
                                               
                                            })
                                            return (
                                                <>
                                                <TableRow key={twitt._id}>
                                                    <TableCell ><Avatar src={twitt.imageUrl}/>{twitt.author}</TableCell>
                                                    <TableCell><a href={twitt.url}>{twitt.url}</a></TableCell>
                                                    <TableCell>{twitt.likes}</TableCell>
                                                    <TableCell>{isTrue?<Button variant='contained' disabled={true}>Like</Button>:<Button color='primary' variant="contained" onClick={()=>{
                                                        setLocalStore(twitt)
                                                        setInLocalStorege(twitt)
                                        }}>like</Button>}</TableCell>
                                                </TableRow>
                                                </>

                                                )})
                                            }

                                    </TableBody>
                                </Table>
                            </TableContainer>
                       {twittList.length==0?<div style={{textAlign:"center"}}>There is no data</div>:""}
                       {/* {twittList.length==0?<div style={{textAlign:"center"}}>There is no data</div>:""} */}

                            
                        </div>
                    )
                }
