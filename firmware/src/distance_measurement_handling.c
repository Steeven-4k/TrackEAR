#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/uart.h>

#include <inttypes.h>
#include <string.h>
#include "time.h"
#include "projectPrint.h"
#include "distance_measurement_handling.h"
/*--------------macro definition---------------*/
#define MAX_NUMBER_Of_MEASUREMENT 64
/*------------variable declaration-------------*/
static uint16_t s_ui16_measurementArrayIterator = 0;
static double s_tlf_measurementArray[MAX_NUMBER_Of_MEASUREMENT] = {0};
static uint32_t s_ui32_startTime = 0;
static double s_lf_distance = 0;
static bool s_is_lostPrevious;
/*-------------function prototype--------------*/
static void dm_handling_sortData(void);
/*----------function implementation------------*/
/*
* description : This function is used initialize the distance measurment file and should be called in the program initialization. 
* parameters :  none.
* retrun     :  none.
*/
void dm_handling_initDistanceMesurementHandling(void)
{
    s_ui32_startTime = time_now();
    s_is_lostPrevious = false;
    return;
}
/*
* description : This function is used to calculate the average of the last measurement if condition are met. The conditions 
*               being either the maximum number of measurement was taken or a certain amount of time as passed (those numbers 
*               are arbitrairy and can be change at will). This function will remove the 10% botom and top outlier from the 
*               data and then average them. If the fileterd distance is above 2.5 meters will set the new distancethe and 
*               boolean passed as parameters to true, false otherwise.   
* parameters :  p_pis_lost : pointer bollean
* retrun     :  none.
*/
void dm_handling_processMesurement(bool *p_pis_lost, double *p_plf_distance)
{
    uint32_t ui32_actualTime = time_now();
    uint32_t ui32_deltaTime = ui32_actualTime - s_ui32_startTime;
    if ( ( ui32_deltaTime >= 50000) || s_ui16_measurementArrayIterator >= MAX_NUMBER_Of_MEASUREMENT) {
        s_ui32_startTime = ui32_actualTime;
        //sort data from lowest to highest
        dm_handling_sortData();
        //get index of the bottom and top 10% to remove
        uint8_t ui8_indexLow10Percent = (s_ui16_measurementArrayIterator + 1) / 10;
        uint8_t ui8_indexHigh10Percent = s_ui16_measurementArrayIterator - ui8_indexLow10Percent;
        //get filtered distance
        uint8_t ui8_filteredDataIterator;
        double lf_distance = 0;
        for ( ui8_filteredDataIterator = ui8_indexLow10Percent ; ui8_filteredDataIterator <= ui8_indexHigh10Percent; ++ui8_filteredDataIterator) {
            lf_distance += s_tlf_measurementArray[ui8_filteredDataIterator];
        }
        //reset data array and iterator
        memset(s_tlf_measurementArray, 0, MAX_NUMBER_Of_MEASUREMENT * sizeof(double));
        s_ui16_measurementArrayIterator = 0;
        //calculate distance average
        s_lf_distance = lf_distance / ui8_filteredDataIterator;
        projectPrint_printfViaUART("distance = ", "%s");
        projectPrint_printfViaUART(&s_lf_distance, "%f");
        projectPrint_printfViaUART("\n", "%s");
        //check if data isn't valid i.e. communcation didn't occur between the cards (!!! not == 0 because double value)
        if (s_lf_distance < 0.01) return;
        //check if distance is above 2.5 meters
        bool is_lostActual = (s_lf_distance > 2.5) ? true : false; 
        //check if reading is the same as the previous one if so will update param boolean and distance
        if (is_lostActual == s_is_lostPrevious) {
            *p_pis_lost = is_lostActual;
            *p_plf_distance = s_lf_distance;
        }
        //save distance check
        s_is_lostPrevious = is_lostActual;
    } else {
        //nothing not enough data 
    }
    return;
}
/*
* description : This function is used to add a value passed as parameter in the data array. It will also increment the
*               array index. 
* parameters :  p_lf_data : double value, value to add to the array
* retrun     :  none.
*/
void dm_handling_addData(double p_lf_data)
{
    s_tlf_measurementArray[s_ui16_measurementArrayIterator] = p_lf_data;
    s_ui16_measurementArrayIterator ++;
    return;
}
/*---------------static function---------------*/
/*
* description : This function is used to sort the data array. This is a bubble sort since the sample sorted is small. 
* parameters :  none.
* retrun     :  none.
*/
static void dm_handling_sortData(void)
{
    for (uint16_t i = 0; i < s_ui16_measurementArrayIterator - 1; ++i) {
        for (uint16_t j = 0; j < s_ui16_measurementArrayIterator - i - 1; ++j) {
            if (s_tlf_measurementArray[j] > s_tlf_measurementArray[j + 1]) {
                // Swap the values
                float temp = s_tlf_measurementArray[j];
                s_tlf_measurementArray[j] = s_tlf_measurementArray[j + 1];
                s_tlf_measurementArray[j + 1] = temp;
            }
        }
    }
    return;
}
/*-----------------end of file-----------------*/