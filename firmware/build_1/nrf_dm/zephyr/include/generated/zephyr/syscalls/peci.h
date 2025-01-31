/* auto-generated by gen_syscalls.py, don't edit */

#ifndef Z_INCLUDE_SYSCALLS_PECI_H
#define Z_INCLUDE_SYSCALLS_PECI_H


#include <zephyr/tracing/tracing_syscall.h>

#ifndef _ASMLANGUAGE

#include <stdarg.h>

#include <zephyr/syscall_list.h>
#include <zephyr/syscall.h>

#include <zephyr/linker/sections.h>


#ifdef __cplusplus
extern "C" {
#endif

extern int z_impl_peci_config(const struct device * dev, uint32_t bitrate);

__pinned_func
static inline int peci_config(const struct device * dev, uint32_t bitrate)
{
#ifdef CONFIG_USERSPACE
	if (z_syscall_trap()) {
		union { uintptr_t x; const struct device * val; } parm0 = { .val = dev };
		union { uintptr_t x; uint32_t val; } parm1 = { .val = bitrate };
		return (int) arch_syscall_invoke2(parm0.x, parm1.x, K_SYSCALL_PECI_CONFIG);
	}
#endif
	compiler_barrier();
	return z_impl_peci_config(dev, bitrate);
}

#if defined(CONFIG_TRACING_SYSCALL)
#ifndef DISABLE_SYSCALL_TRACING

#define peci_config(dev, bitrate) ({ 	int syscall__retval; 	sys_port_trace_syscall_enter(K_SYSCALL_PECI_CONFIG, peci_config, dev, bitrate); 	syscall__retval = peci_config(dev, bitrate); 	sys_port_trace_syscall_exit(K_SYSCALL_PECI_CONFIG, peci_config, dev, bitrate, syscall__retval); 	syscall__retval; })
#endif
#endif


extern int z_impl_peci_enable(const struct device * dev);

__pinned_func
static inline int peci_enable(const struct device * dev)
{
#ifdef CONFIG_USERSPACE
	if (z_syscall_trap()) {
		union { uintptr_t x; const struct device * val; } parm0 = { .val = dev };
		return (int) arch_syscall_invoke1(parm0.x, K_SYSCALL_PECI_ENABLE);
	}
#endif
	compiler_barrier();
	return z_impl_peci_enable(dev);
}

#if defined(CONFIG_TRACING_SYSCALL)
#ifndef DISABLE_SYSCALL_TRACING

#define peci_enable(dev) ({ 	int syscall__retval; 	sys_port_trace_syscall_enter(K_SYSCALL_PECI_ENABLE, peci_enable, dev); 	syscall__retval = peci_enable(dev); 	sys_port_trace_syscall_exit(K_SYSCALL_PECI_ENABLE, peci_enable, dev, syscall__retval); 	syscall__retval; })
#endif
#endif


extern int z_impl_peci_disable(const struct device * dev);

__pinned_func
static inline int peci_disable(const struct device * dev)
{
#ifdef CONFIG_USERSPACE
	if (z_syscall_trap()) {
		union { uintptr_t x; const struct device * val; } parm0 = { .val = dev };
		return (int) arch_syscall_invoke1(parm0.x, K_SYSCALL_PECI_DISABLE);
	}
#endif
	compiler_barrier();
	return z_impl_peci_disable(dev);
}

#if defined(CONFIG_TRACING_SYSCALL)
#ifndef DISABLE_SYSCALL_TRACING

#define peci_disable(dev) ({ 	int syscall__retval; 	sys_port_trace_syscall_enter(K_SYSCALL_PECI_DISABLE, peci_disable, dev); 	syscall__retval = peci_disable(dev); 	sys_port_trace_syscall_exit(K_SYSCALL_PECI_DISABLE, peci_disable, dev, syscall__retval); 	syscall__retval; })
#endif
#endif


extern int z_impl_peci_transfer(const struct device * dev, struct peci_msg * msg);

__pinned_func
static inline int peci_transfer(const struct device * dev, struct peci_msg * msg)
{
#ifdef CONFIG_USERSPACE
	if (z_syscall_trap()) {
		union { uintptr_t x; const struct device * val; } parm0 = { .val = dev };
		union { uintptr_t x; struct peci_msg * val; } parm1 = { .val = msg };
		return (int) arch_syscall_invoke2(parm0.x, parm1.x, K_SYSCALL_PECI_TRANSFER);
	}
#endif
	compiler_barrier();
	return z_impl_peci_transfer(dev, msg);
}

#if defined(CONFIG_TRACING_SYSCALL)
#ifndef DISABLE_SYSCALL_TRACING

#define peci_transfer(dev, msg) ({ 	int syscall__retval; 	sys_port_trace_syscall_enter(K_SYSCALL_PECI_TRANSFER, peci_transfer, dev, msg); 	syscall__retval = peci_transfer(dev, msg); 	sys_port_trace_syscall_exit(K_SYSCALL_PECI_TRANSFER, peci_transfer, dev, msg, syscall__retval); 	syscall__retval; })
#endif
#endif


#ifdef __cplusplus
}
#endif

#endif
#endif /* include guard */
