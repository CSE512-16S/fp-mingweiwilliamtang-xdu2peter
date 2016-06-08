library(dplyr)

zip_all= read.csv("~/Downloads/zipcode/zipcode.csv")

head(zip_all)
names(zip_all)
WA_zip = filter(zip_all,state == "WA")
zipQoQ = read.csv("~/Downloads/Zip_Zhvi_Summary_AllHomes.csv",header= T)
AllHouse = read.csv("~/Downloads/Zip_Zhvi_AllHomes.csv",header = T)
AllHouse_sqrft = read.csv("~/Downloads/Zip_MedianValuePerSqft_AllHomes.csv")
WAAllHouse = AllHouse[AllHouse_sqrft == "WA",]
zipQoQ = filter(zipQoQ, State == "WA")
WA_zip = WA_zip %>% inner_join(zipQoQ,c("zip" = "RegionName"))
WA_zip = WA_zip %>% inner_join(WAAllHouse,c("zip" = "RegionName"))
WA_zip = select(WA_zip,zip,city,latitude,longitude,QoQ,YoY,MoM,price=X2016.04)
colnames(WA_zip)
filter(zip_all,zip == "98110")


cities = "Seattle
Tacoma
Bellevue
Everett
Auburn
Bainbridge Island
Beaux Arts Village
Bonney Lake
Bothell
Bremerton
Brier
Burien
Covington
Des Moines
Duvall
Enumclaw
Edmonds
Federal Way
Gig Harbor
Issaquah
Kenmore
Kent
Kirkland
Lake Forest Park
Lake Stevens
Lakewood
Lynnwood
Maple Valley
Marysville
Mercer Island
Mill Creek
Mountlake Terrace
Mukilteo
Newcastle
Normandy Park
Puyallup
Poulsbo
Redmond
Renton
Sammamish
SeaTac
Shoreline
Silverdale
Tukwila
Woodinville
Woodway"


cities_array = strsplit(cities,"\n")[[1]]
cities_array

GSeattle_zip = filter(WA_zip,city %in% cities_array)

write.csv(WA_zip,"~/Dropbox/cse512_final_proj/code/dat/WA_zip.csv",row.names=FALSE)
write.csv(GSeattle_zip,"~/Dropbox/cse512_final_proj/code/dat/GSeattle.csv",row.names=FALSE)


state_sale_all = read.csv("~/Dropbox/cse512_final_proj/code/dat/Zip_Zhvi_AllHomes.csv",header = T)
colnames(state_sale_all)[1:10]
dim(state_sale_all)
WA_sale_all = filter(state_sale_all,State == "WA")
WA_sale_allt = t(WA_sale_all[8:247])
colnames(WA_sale_allt) = WA_sale_all[,2]  
head(WA_sale_allt)
write.csv()
parsedata = function(X){
  return(
 as.character(sapply(rownames(X),function(x){
  return(gsub(pattern= "[.]",replacement = "",
              x = gsub(pattern = "[X]", replacement = "", x = x, ignore.case = T),
              ignore.case = T))
})))
}
rownames(WA_sale_allt) = parsedata(WA_sale_allt)
       
write.csv(WA_sale_allt,"~/Dropbox/cse512_final_proj/code/dat/WA_sale_all.csv")

# time series date 

psqrft = read.csv("~/Dropbox/cse512_final_proj/code/dat/Zip_MedianValuePerSqft_AllHomes.csv")
dim(psqrft)
colnames(psqrft)[1:10]
psqrft = psqrft[,c(2,8:247)]
dim(psqrft)
colnames(psqrft)[c(1:10,236:241)]
psqrft = WA_zip %>% inner_join(psqrft,c("zip" = "RegionName"))
psqrft = psqrft[,-c(2:8)]
dim(psqrft)
colnames(psqrft)[1:4]
yearId = colnames(psqrft)[2:241]

colnames(psqrft)[2:241] = as.character(sapply(yearId,function(x){
  return(gsub(pattern= "[.]",replacement = "",
              x = gsub(pattern = "[X]", replacement = "", x = x, ignore.case = T),
              ignore.case = T))
}
))
colnames(psqrft)
write.csv(psqrft,"~/Dropbox/cse512_final_proj/code/dat/psqrft.csv",row.names=FALSE)
psqrft[257,1]
psqrft[is.na(psqrft)]=NA
a=c(1:20)
a[c(2:10)] = NA
a
min(psqrft[psqrft$zip=="98011",])
