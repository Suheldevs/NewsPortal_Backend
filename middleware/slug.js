import slugify from 'slugify'
const Slug = (text)=>{
 const newSlug =   slugify(text, {
  replacement: '-',  
  remove: /[*+~.()'"!:@]/g, 
  lower: true,      
  strict: false,       
  trim: true         
})
return newSlug ;
}

export default Slug