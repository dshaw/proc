# Proc

Expose system state via the /proc file system.

## Known limitations

This was written for Voxer to use on Joyent. It has not been tested outside of SmartOS and there really are no expectations that this should run on anything but some flavor of Solaris. I am open to having this module supporting Linux, too and I have talked to multiple people who would be interested in having that exist. I leave it up to you, the contributor, to decide if you'd rather contribute that to this module or run with it in your own module.

## usage

Expose elements of `/proc`

### Usage usage (Oh, so meta.)

``` js
var proc = require('proc');

proc.usage(function (err, usage_obj) {
  console.dir(usage_obj);
});
```

### Usage psinfo

``` js
var proc = require('proc');

proc.psinfo(function (err, psinfo_t) {
  console.dir(psinfo_t);
});
```


## CLI install

    npm install -g proc

## CLI usage

    proc usage 10008

This will produce a JSON string, so it works great with something like [jsontool](https://github.com/trentm/json).

    proc usage 10008 | json

## Underlying data structure

### usage
``` c
/*
 * Resource usage.
 */
typedef struct prusage {
	id_t		pr_lwpid;	/* lwp id.  0: process or defunct */
	int		    pr_count;	/* number of contributing lwps */
	timestruc_t	pr_tstamp;	/* current time stamp */
	timestruc_t	pr_create;	/* process/lwp creation time stamp */
	timestruc_t	pr_term;	/* process/lwp termination time stamp */
	timestruc_t	pr_rtime;	/* total lwp real (elapsed) time */
	timestruc_t	pr_utime;	/* user level cpu time */
	timestruc_t	pr_stime;	/* system call cpu time */
	timestruc_t	pr_ttime;	/* other system trap cpu time */
	timestruc_t	pr_tftime;	/* text page fault sleep time */
	timestruc_t	pr_dftime;	/* data page fault sleep time */
	timestruc_t	pr_kftime;	/* kernel page fault sleep time */
	timestruc_t	pr_ltime;	/* user lock wait sleep time */
	timestruc_t	pr_slptime;	/* all other sleep time */
	timestruc_t	pr_wtime;	/* wait-cpu (latency) time */
	timestruc_t	pr_stoptime;	/* stopped time */
	timestruc_t	filltime[6];	/* filler for future expansion */
	ulong_t		pr_minf;	/* minor page faults */
	ulong_t		pr_majf;	/* major page faults */
	ulong_t		pr_nswap;	/* swaps */
	ulong_t		pr_inblk;	/* input blocks */
	ulong_t		pr_oublk;	/* output blocks */
	ulong_t		pr_msnd;	/* messages sent */
	ulong_t		pr_mrcv;	/* messages received */
	ulong_t		pr_sigs;	/* signals received */
	ulong_t		pr_vctx;	/* voluntary context switches */
	ulong_t		pr_ictx;	/* involuntary context switches */
	ulong_t		pr_sysc;	/* system calls */
	ulong_t		pr_ioch;	/* chars read and written */
	ulong_t		filler[10];	/* filler for future expansion */
} prusage_t;
```

### psinfo
``` c
/*
 * process ps(1) information file.  /proc/<pid>/psinfo
 */
#define PRARGSZ         80      /* number of chars of arguments */
typedef struct psinfo {
        int     pr_flag;        /* process flags (DEPRECATED; do not use) */
        int     pr_nlwp;        /* number of active lwps in the process */
        pid_t   pr_pid;         /* unique process id */
        pid_t   pr_ppid;        /* process id of parent */
        pid_t   pr_pgid;        /* pid of process group leader */
        pid_t   pr_sid;         /* session id */
        uid_t   pr_uid;         /* real user id */
        uid_t   pr_euid;        /* effective user id */
        gid_t   pr_gid;         /* real group id */
        gid_t   pr_egid;        /* effective group id */
        uintptr_t pr_addr;      /* address of process */
        size_t  pr_size;        /* size of process image in Kbytes */
        size_t  pr_rssize;      /* resident set size in Kbytes */
        size_t  pr_pad1;
        dev_t   pr_ttydev;      /* controlling tty device (or PRNODEV) */
                        /* The following percent numbers are 16-bit binary */
                        /* fractions [0 .. 1] with the binary point to the */
                        /* right of the high-order bit (1.0 == 0x8000) */
        ushort_t pr_pctcpu;     /* % of recent cpu time used by all lwps */
        ushort_t pr_pctmem;     /* % of system memory used by process */
        timestruc_t pr_start;   /* process start time, from the epoch */
        timestruc_t pr_time;    /* usr+sys cpu time for this process */
        timestruc_t pr_ctime;   /* usr+sys cpu time for reaped children */
        char    pr_fname[PRFNSZ];       /* name of execed file */
        char    pr_psargs[PRARGSZ];     /* initial characters of arg list */
        int     pr_wstat;       /* if zombie, the wait() status */
        int     pr_argc;        /* initial argument count */
        uintptr_t pr_argv;      /* address of initial argument vector */
        uintptr_t pr_envp;      /* address of initial environment vector */
        char    pr_dmodel;      /* data model of the process */
        char    pr_pad2[3];
        taskid_t pr_taskid;     /* task id */
        projid_t pr_projid;     /* project id */
        int     pr_nzomb;       /* number of zombie lwps in the process */
        poolid_t pr_poolid;     /* pool id */
        zoneid_t pr_zoneid;     /* zone id */
        id_t    pr_contract;    /* process contract */
        int     pr_filler[1];   /* reserved for future use */
        lwpsinfo_t pr_lwp;      /* information for representative lwp */
} psinfo_t;
```


## License

(The MIT License)

Copyright (c) 2012 Daniel D. Shaw <dshaw@dshaw.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
