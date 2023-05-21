ARG BUILDER_TAG
FROM ${BUILDER_TAG} AS builder

# install all dependencies
COPY bin/ ./bin/
COPY Makefile package.json yarn.lock ./
RUN set -eux;\
  eval "$(hermit env --activate)";\
  make install

# build
COPY ./ ./
RUN set -eux;\
  eval "$(hermit env --activate)";\
  export CI_COMMIT_SHORT_SHA=builder;\
  make build

FROM node:16.13.1-alpine AS runner


WORKDIR /app

ENV NODE_ENV production

RUN set -eux;\
  addgroup -g 1001 -S nodejs;\
  adduser -S nextjs -u 1001;

COPY --from=builder --chown=nextjs:nodejs /work/public/ ./public/
COPY --from=builder --chown=nextjs:nodejs /work/.next/ ./.next/
COPY --from=builder --chown=nextjs:nodejs /work/node_modules ./node_modules/
COPY --from=builder --chown=nextjs:nodejs /work/.env.production /work/next.config.js /work/package.json ./

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD [ "node_modules/.bin/next", "start" ]
