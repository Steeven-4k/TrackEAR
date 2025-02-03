#ifndef _PROJECTPRINT_H
#define _PROJECTPRINT_H

#define MSG_SIZE 128

//functions prototypes
void projectPrint_printfViaUART(void *buf, const char *p_c_format);
int projectPrint_init(void);
int projectPrint_getMsg(void *data);


#endif