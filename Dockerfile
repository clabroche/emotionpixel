FROM alpine:3.8 as builder
RUN apk --no-cache add gcc g++ make python nodejs npm
WORKDIR /locationsharing
COPY ./server .
RUN rm -rf .git && rm -rf node_modules && npm i --production

FROM alpine:3.8
RUN apk --no-cache add nodejs
WORKDIR /locationsharing
COPY --from=builder /locationsharing .
CMD ["node", "bin/www"]
