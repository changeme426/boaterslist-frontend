# dev/pipeline builder image. build with: docker build -f ./builder.Dockerfile ..

FROM ubuntu:20.04

WORKDIR /work

# install base dependencies including hermit (should change infrequently)
COPY .cicd/install-build.sh /work/.cicd/
RUN ./.cicd/install-build.sh

COPY bin/hermit bin/activate-hermit /work/bin/

ENV PATH="/work/bin:${PATH}"
RUN set -eux;\
  hermit install;\
  eval "$(hermit env --activate)";\
  hermit sync

# install all dependencies
COPY bin/ /work/bin/
COPY Makefile package.json yarn.lock /work/
COPY .env.go.tpl /work/
COPY packages/common/package.json /work/packages/common/
COPY packages/native-app/Makefile packages/native-app/package.json /work/packages/native-app/
COPY packages/web-app/Makefile packages/web-app/package.json /work/packages/web-app/

RUN set -eux;\
  eval "$(hermit env --activate)";\
  make install

#  export CI_COMMIT_SHORT_SHA=builder
