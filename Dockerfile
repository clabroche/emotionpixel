FROM alpine:3.15 as builder
RUN apk --no-cache add gcc g++ make python3 nodejs npm
WORKDIR /emotionpixel
COPY ./server .
RUN npm i --production

FROM alpine:3.15
RUN apk --no-cache add nodejs
WORKDIR /emotionpixel
COPY --from=builder /emotionpixel .
CMD ["node", "bin/www"]
