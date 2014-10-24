-- lua script to manage any art assets

local grd=require("grd")


function exists(n)
	local f=io.open(n)
	if f then
		io.close(f)
		return true
	end
	return false
end


if false then

local ds={2,4,6,8,10,12,20}

for _,d in ipairs(ds) do

	
	local filename_out="art/die/d"..d..".png"
	print("preping "..filename_out)
	local ga=grd.create("GRD_FMT_U8_BGRA",100*d,100,1)
	print(ga.width,ga.height)
	
	for i=1,d do
	
		local filename="art/die/d"..d.."."..i..".png"
		print("adding "..filename)
		
		local gb=grd.create("GRD_FMT_U8_BGRA",filename)
		
		local pix=gb:pixels(0,0,100,100)
		
		for i=1,#pix,4 do -- make pure white transparent
			local a,r,g,b=pix[i],pix[i+1],pix[i+2],pix[i+3]
--			g=math.floor((r+g+b)/3)
			r=g
			b=g
			if r==255 and g==255 and b==255 then
				a=0
			end
			pix[i],pix[i+1],pix[i+2],pix[i+3]=a,r,g,b
		end
		
		ga:pixels(100*(i-1),0,100,100,pix)
	
	end
	
	ga:save(filename_out)

end

	
end
