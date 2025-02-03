#ifndef _DM_HANDLING_H
#define _DM_HANDLING_H

void dm_handling_initDistanceMesurementHandling(void);
void dm_handling_processMesurement(bool *p_pis_lost, double *p_plf_distance);
void dm_handling_addData(double p_lf_data);

#endif