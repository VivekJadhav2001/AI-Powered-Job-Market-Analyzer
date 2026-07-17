

const uploadJobListings = async(req , res , next)=>{
    try {
        const {jobListings} = req.body

        if(!jobListings){
            return res.success(400,"Please Provide The Job Listings")
        }

        
    } catch (error) {
        next(error)
    }
}

export {
    uploadJobListings
}