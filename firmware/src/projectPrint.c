#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/uart.h>

#include <string.h>
#include "projectPrint.h"

/* change this to any other UART peripheral if desired */
#define UART_DEVICE_NODE DT_CHOSEN(zephyr_shell_uart)

/* queue to store up to 10 messages (aligned to 4-byte boundary) */
K_MSGQ_DEFINE(uart_msgq, MSG_SIZE, 10, 4);

static const struct device *const uart_dev = DEVICE_DT_GET(UART_DEVICE_NODE);

/*used to received data via serial : not used as of the end of the project but kept just in case 
//receive buffer used in UART ISR callback
static char rx_buf[MSG_SIZE];
static int rx_buf_pos;

/*-------------function prototype--------------*/
/*used to received data via serial : not used as of the end of the project but kept just in case 
static void serial_cb(const struct device *dev, void *user_data);*/
/*----------function implementation------------*/
/*
 * Print a null-terminated string character by character to the UART interface
 */
void projectPrint_printfViaUART(void *buf, const char *p_c_format)
{
	char data_to_send[MSG_SIZE];
	//compare p_c_format to known format to convert them to a string
	if (strcmp(p_c_format,"%s") == 0) {
		strcpy( data_to_send, (const char*)buf );
	} else if (strcmp((const char *)p_c_format,"%d") == 0) {
		snprintf(data_to_send, MSG_SIZE, "%d", *(int *)buf);
	} else if (strcmp((const char *)p_c_format,"%f") == 0){
		snprintf(data_to_send, MSG_SIZE, "%f", *(double*)buf);
	}
	//get string lenght
	int msg_len = strlen(data_to_send);
	//send data byte by byte
	for (int i = 0; i < msg_len; i++) {
		uart_poll_out(uart_dev, data_to_send[i]);
	}
}
/*used to received data via serial : not used as of the end of the project but kept just in case 
int projectPrint_init(void)
{
    if (!device_is_ready(uart_dev)) {
		printk("UART device not found!");
		return 0;
	}

	//configure interrupt and callback to receive data
	int ret = uart_irq_callback_user_data_set(uart_dev, serial_cb, NULL);

	if (ret < 0) {
		if (ret == -ENOTSUP) {
			printk("Interrupt-driven UART API support not enabled\n");
		} else if (ret == -ENOSYS) {
			printk("UART device does not support interrupt-driven API\n");
		} else {
			printk("Error setting UART callback: %d\n", ret);
		}
		return 0;
	}
	uart_irq_rx_enable(uart_dev);
    return 1;
}*/
/*used to received data via serial : not used as of the end of the project but kept just in case 
int projectPrint_getMsg(void *data)
{
    return k_msgq_get(&uart_msgq, &data, K_FOREVER);
}*/
/*---------------static function---------------*/
/*used to received data via serial : not used as of the end of the project but kept just in case
/*
 * Read characters from UART until line end is detected. Afterwards push the
 * data to the message queue.
 
static void serial_cb(const struct device *dev, void *user_data)
{
	uint8_t c;

	if (!uart_irq_update(uart_dev)) {
		return;
	}

	if (!uart_irq_rx_ready(uart_dev)) {
		return;
	}

	//read until FIFO empty
	while (uart_fifo_read(uart_dev, &c, 1) == 1) {
		if ((c == '\n' || c == '\r') && rx_buf_pos > 0) {
			//terminate string
			rx_buf[rx_buf_pos] = '\0';

			//if queue is full, message is silently dropped
			k_msgq_put(&uart_msgq, &rx_buf, K_NO_WAIT);

			//reset the buffer (it was copied to the msgq)
			rx_buf_pos = 0;
		} else if (rx_buf_pos < (sizeof(rx_buf) - 1)) {
			rx_buf[rx_buf_pos++] = c;
		}
		//else: characters beyond buffer size are dropped
	}
}*/
//end of file