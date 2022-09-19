FROM public.ecr.aws/lambda/nodejs:14

RUN yum install -y nmap iputils bind-utils whois && yum clean all

COPY node_modules ${LAMBDA_TASK_ROOT}/node_modules

COPY index.js ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
