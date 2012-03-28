#include "node.h"

#include <unistd.h> /* getpagesize() */
#include <stdlib.h> /* getexecname() */
#include <strings.h> /* strncpy() */

#include <kstat.h>
#include <errno.h>
#include <inttypes.h>
#include <sys/types.h>
#include <sys/loadavg.h>
#include <sys/socket.h>
#include <net/if.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <fcntl.h>

#if (!defined(_LP64)) && (_FILE_OFFSET_BITS - 0 == 64)
#define PROCFS_FILE_OFFSET_BITS_HACK 1
#undef _FILE_OFFSET_BITS
#else
#define PROCFS_FILE_OFFSET_BITS_HACK 0
#endif

#include <sys/procfs.h>

#if (PROCFS_FILE_OFFSET_BITS_HACK - 0 == 1)
#define _FILE_OFFSET_BITS 64
#endif


using namespace std;
using namespace node;
using namespace v8;


static Handle<Value> GetUsage(const Arguments &args);
static Handle<Value> GetMsnd(const Arguments &args);
static Handle<Value> GetIoch(const Arguments &args);
extern "C" void init (Handle<Object>);

/*
 * Get usage.
 */
static Handle<Value> GetUsage(const Arguments &args) {
  HandleScope scope;
  prusage_t prusage;
  int fd;
  Local<Object> usage = Object::New();

  if ((fd = open("/proc/self/usage", O_RDONLY)) < 0)
    return scope.Close(usage);

  if (read(fd, &prusage, sizeof (prusage_t)) != sizeof (prusage_t)) {
    (void) close(fd);
    return scope.Close(usage);
  }

  usage->Set(String::New("lwpid"), Integer::New((id_t) prusage.pr_lwpid));
  usage->Set(String::New("count"), Integer::New((int) prusage.pr_count));
  usage->Set(String::New("minf"), Integer::New((ulong_t) prusage.pr_minf));
  usage->Set(String::New("majf"), Integer::New((ulong_t) prusage.pr_majf));
  usage->Set(String::New("nswap"), Integer::New((ulong_t) prusage.pr_nswap));
  usage->Set(String::New("inblk"), Integer::New((ulong_t) prusage.pr_inblk));
  usage->Set(String::New("oublk"), Integer::New((ulong_t) prusage.pr_oublk));
  usage->Set(String::New("msnd"), Integer::New((ulong_t) prusage.pr_msnd));
  usage->Set(String::New("mrcv"), Integer::New((ulong_t) prusage.pr_mrcv));
  usage->Set(String::New("sigs"), Integer::New((ulong_t) prusage.pr_sigs));
  usage->Set(String::New("vctx"), Integer::New((ulong_t) prusage.pr_vctx));
  usage->Set(String::New("ictx"), Integer::New((ulong_t) prusage.pr_ictx));
  usage->Set(String::New("sysc"), Integer::New((ulong_t) prusage.pr_sysc));
  usage->Set(String::New("ioch"), Integer::New((ulong_t) prusage.pr_ioch));

  (void) close(fd);

  return scope.Close(usage);
}

static Handle<Value> GetMsnd(const Arguments &args) {
  HandleScope scope;
  prusage_t prusage;
  ulong_t msnd;
  int fd;

  if ((fd = open("/proc/self/usage", O_RDONLY)) < 0)
    return scope.Close(Integer::New(-1));

  if (read(fd, &prusage, sizeof (prusage_t)) != sizeof (prusage_t)) {
    (void) close(fd);
    return scope.Close(Integer::New(-1));
  }

  msnd = (ulong_t) prusage.pr_msnd;
  (void) close(fd);

  return scope.Close(Integer::New(msnd));
}

static Handle<Value> GetIoch(const Arguments &args) {
  HandleScope scope;
  prusage_t prusage;
  ulong_t ioch;
  int fd;

  if ((fd = open("/proc/self/usage", O_RDONLY)) < 0)
    return scope.Close(Integer::New(-1));

  if (read(fd, &prusage, sizeof (prusage_t)) != sizeof (prusage_t)) {
    (void) close(fd);
    return scope.Close(Integer::New(-1));
  }

  ioch = (ulong_t) prusage.pr_ioch;
  (void) close(fd);

  return scope.Close(Integer::New(ioch));
}

extern "C" void init (Handle<Object> target) {
  HandleScope scope;
  NODE_SET_METHOD(target, "usage", GetUsage);
  NODE_SET_METHOD(target, "msnd", GetMsnd);
  NODE_SET_METHOD(target, "ioch", GetIoch);
}