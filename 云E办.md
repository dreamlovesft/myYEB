# 云E办

![image-20210729111637205](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210729111637205.png)

# 前端

安装vue/cli

npm install -g @vue/cli

测试安装

```
vue --version
```

启动

```
npm install
npm run serve
#重启
vue-cli-service serve
就i回到8080端口了
```

安装组件 element

```
npm i element-ui -S
```

```
netstat -aon|findstr "8080"
tasklist | findstr 5104
```

# 后端

三个模块

### 逆向工程：

#### 依赖

```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.song</groupId>
  <artifactId>yeb-generator</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <parent>
    <groupId>com.song</groupId>
    <artifactId>yeb</artifactId>
    <version>0.0.1-SNAPSHOT</version>
  </parent>


  <name>yeb-generator</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <!--web 依赖-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!--mybatis-plus 依赖-->
    <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-boot-starter</artifactId>
      <version>3.3.1.tmp</version>
    </dependency>
    <!--mybatis-plus 代码生成器依赖-->
    <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-generator</artifactId>
      <version>3.3.1.tmp</version>
    </dependency>
    <!--freemarker 依赖-->
    <dependency>
      <groupId>org.freemarker</groupId>
      <artifactId>freemarker</artifactId>
    </dependency>
    <!--mysql 依赖-->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build></build>
</project>

```

#### 生成类

```java
package com.song.generator;

import com.baomidou.mybatisplus.core.exceptions.MybatisPlusException;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * @program: yeb
 * @description: 逆向工程
 * @author: Songfangteng
 * @create: 2021-07-29 15:15
 **/
public class CodeGenerator {
    /**
     * <p>
     * 读取控制台内容
     * </p>
     */
    public static String scanner(String tip) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder help = new StringBuilder();
        help.append("请输入" + tip + "：");
        System.out.println(help.toString());
        if (scanner.hasNext()) {
            String ipt = scanner.next();
            if (StringUtils.isNotEmpty(ipt)) {
                return ipt;
            }
        }
        throw  new MybatisPlusException("请输入正确的" + tip + "！");
    }
    public static void main(String[] args) {
        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();
        // 全局配置
        GlobalConfig gc = new GlobalConfig();
        String projectPath = System.getProperty("user.dir");
        gc.setOutputDir(projectPath + "/yeb-generator/src/main/java");
        //作者
        gc.setAuthor("songfangteng");
        //打开输出目录
        gc.setOpen(false);
        //xml开启 BaseResultMap
        gc.setBaseResultMap(true);
        //xml 开启BaseColumnList
        gc.setBaseColumnList(true);
        // 实体属性 Swagger2 注解
        gc.setSwagger2(true);
        mpg.setGlobalConfig(gc);
        // 数据源配置
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setUrl("jdbc:mysql://localhost:3306/yeb?useUnicode=true&characterEncoding=UTF8&serverTimezone=Asia/Shanghai");
        dsc.setDriverName("com.mysql.jdbc.Driver");
        dsc.setUsername("root");
        dsc.setPassword("1234");
        mpg.setDataSource(dsc);
        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setParent("com.song.server")
                .setEntity("pojo")
                .setMapper("mapper")
                .setService("service")
                .setServiceImpl("service.impl")
                .setController("controller");
        mpg.setPackageInfo(pc);
        // 自定义配置
        InjectionConfig cfg = new InjectionConfig() {
            @Override
            public void initMap() {
                // to do nothing
            }
        };
        // 如果模板引擎是 freemarker
        String templatePath = "/templates/mapper.xml.ftl";
        // 如果模板引擎是 velocity
        // String templatePath = "/templates/mapper.xml.vm";
        // 自定义输出配置
        List<FileOutConfig> focList = new ArrayList<>();
        // 自定义配置会被优先输出
        focList.add(new FileOutConfig(templatePath) {
            @Override
            public String outputFile(TableInfo tableInfo) {
                // 自定义输出文件名 ， 如果你 Entity 设置了前后缀、此处注意 xml 的名称会
                return projectPath + "/yeb-generator/src/main/resources/mapper/"
                        + tableInfo.getEntityName() + "Mapper"
                        + StringPool.DOT_XML;
            }
        });
        cfg.setFileOutConfigList(focList);
        mpg.setCfg(cfg);
        // 配置模板
        TemplateConfig templateConfig = new TemplateConfig();
        templateConfig.setXml(null);
        mpg.setTemplate(templateConfig);
        // 策略配置
        StrategyConfig strategy = new StrategyConfig();
        //数据库表映射到实体的命名策略
        strategy.setNaming(NamingStrategy.underline_to_camel);
        //数据库表字段映射到实体的命名策略
        strategy.setColumnNaming(NamingStrategy.no_change);
        //lombok模型
        strategy.setEntityLombokModel(true);
        //生成 @RestController 控制器
        strategy.setRestControllerStyle(true);
        strategy.setInclude(scanner("表名，多个英文逗号分割").split(","));
        strategy.setControllerMappingHyphenStyle(true);
        //表前缀
        strategy.setTablePrefix("t_");
        mpg.setStrategy(strategy);
        mpg.setTemplateEngine(new FreemarkerTemplateEngine());
        mpg.execute();
    }
}

```

t_admin,t_admin_role,t_appraise,t_department,t_employee,t_employee_ec,t_employee_remove,t_employee_train,t_joblevel,t_mail_log,t_menu,t_menu_role,t_nation,t_oplog,t_politics_status,t_position,t_role,t_salary,t_salary_adjust,t_sys_msg,t_sys_msg_content

## JWT TOKEN

验证前端传过来的用户和密码是否正确，是的化生成JWT令牌，否则要求重新输入，令牌会放在请求头，验证令牌是否有效，合法有效才允许访问其他接口。

工具类

```java
package com.song.server.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @program: yeb
 * @description: Jwt工具类
 * @author: Songfangteng
 * @create: 2021-07-29 15:44
 **/
@Component
public class JwtTokenUtil {
    private static final String CLAIM_KEY_USERNAME = "sub"; //放在荷载里面 用户名
    private static final String CLAIM_KEY_CREATED = "created";  //放在荷载里面 创建时间

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * 根据用户信息生成token
     * @param userDetails
     * @return
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(CLAIM_KEY_USERNAME, userDetails.getUsername());
        claims.put(CLAIM_KEY_CREATED, new Date());
        return generateToken(claims);
    }

    /**
     * 从token 中获取用户信息
     * @param token
     * @return
     */
    public String getUsernameFromToken(String token) {
        String username = null;
        try {
            Claims claims = getClaimsFromToken(token);
            username = claims.getSubject();
        } catch (Exception e) {
            username = null;
        }

        return username ;
    }

    /**
     * 从token 中获取荷载
     * @param token
     * @return
     */
    private Claims getClaimsFromToken(String token) {
        Claims claims = null;
        try {
            claims = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            claims = null;
        }
        return claims;
    }

    /**
     * token 是否有效
     * @param token
     * @param userDetails
     * @return
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    /**
     * token 是否失效
     * @param token
     * @return
     */
    private boolean isTokenExpired(String token) {
        Date expiredDate = getExpiredDateFromToken(token);
        return expiredDate.before(new Date());
    }

    /**
     * 从token 中获取失效时间
     *
     * @param token
     * @return
     */
    private Date getExpiredDateFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getExpiration();
    }

    /**
     * 判断token 是否能被刷新
     * @param token
     * @return
     */
    private boolean canRefresh(String token) {
        return !isTokenExpired(token);
    }

    /**
     * 刷新token
     * @param token
     * @return
     */
    public String refreshToken(String token) {
        Claims claims = getClaimsFromToken(token);
        claims.put(CLAIM_KEY_CREATED, new Date());
        return generateToken(claims);
    }
    /**
     * 根据荷载 生成 jwt token
     * @param claims
     * @return
     */
    private String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secret)
                .setExpiration(generateExpirationDate())
                .compact();
    }

    /**
     * 生成 token失效时间
     * @return
     */
    private Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + expiration * 1000);
    }
}
```

#### JWT登录授权

## 接口文档

### Swagger

自动生成接口文档

## redis

### 缓存高频信息

RedisConfig

```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory redisConnectionFactory){
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        // String 类型 key 序列器
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        //String 类型 value 序列器
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        return redisTemplate;
    }
}
```

MenuServiceImpl

```java
@Service
public class MenuServiceImpl extends ServiceImpl<MenuMapper, Menu> implements IMenuService {
    @Autowired
    private MenuMapper menuMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 根据用户id 查询菜单列表
     * @return
     */
    @Override
    public List<Menu> getMenusByAdminId() {
        Integer adminId = ((Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        //菜单信息缓存到Redis
        ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
        List<Menu> menus = (List<Menu>) valueOperations.get("menu_" + adminId);
        // 从Redis 获取菜单数据，如果为空，从数据库获取
        if (CollectionUtils.isEmpty(menus)) {
            menus = menuMapper.getMenusByAdminId(adminId);
            //将数据设置到 Redis中
            valueOperations.set("menu_" + adminId, menus);
        }
        return menus;
    }

}
```

![image-20210729215027524](C:/Users/songfangteng521/AppData/Roaming/Typora/typora-user-images/image-20210729215027524.png)

![image-20210729215116226](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210729215116226.png)

![image-20210729215314057](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210729215314057.png)

根据请求url判断角色，根据用户判断角色，根据用户的角色授权资源

## 全局异常处理





## 存储过程

![image-20210730110215830](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210730110215830.png)

存储过程的创建和调用

- 存储过程就是具有名字的一段代码，用来完成一个特定功能
- 保存在数据库的数据字典中

### 创建存储过程

```sql
CREATE
    [DEFINER = { user | CURRENT_USER }]
　PROCEDURE sp_name ([proc_parameter[,...]])
    [characteristic ...] routine_body

proc_parameter:
    [ IN | OUT | INOUT ] param_name type

characteristic:
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }

routine_body:
　　Valid SQL routine statement

[begin_label:] BEGIN
　　[statement_list]
　　　　……
END [end_label]
```

在定义过程时，使用DELIMITER $$ 命令将语句的结束符号从分号 ; 临时改为两个$$，使得过程体中使用的分号被直接传递到服务器，而不会被客户端（如mysql）解释。变量@开头

![image-20210730110812799](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210730110812799.png)

### 调用存储过程

```
call sp_name[(传参)];
```

![image-20210730111225696](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210730111225696.png)

![image-20210730111411456](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210730111411456.png)

## 部门管理

### 添加部门



### 删除部门



### 操作员

#### 操作员角色功能的实现

操作员所有的角色

操作员本身自带的角色

更新操作员角色

## 员工管理

### 分页查询

员工表，关联的表很多

![image-20210730155003117](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210730155003117.png)

分页插件

注意别忘记注解@Configuration 否则会返回一整页，而没有分页效果，一般不报错但配置类不生效可能配置类里没有添加对应的注解

```java
/**
 * @program: yeb
 * @description: 分页配置
 * @author: Songfangteng
 * @create: 2021-07-30 15:52
 **/
@Configuration
public class MybatisPlusConfig {
    @Bean
    public PaginationInterceptor paginationInterceptor(){

        return new PaginationInterceptor();
    }
}
```



分页公共返回对象



全局日期转换





![image-20210730165420193](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210730165420193.png)

### 添加员工

获取新员工信息，mybatisPlus单表查询

```java
 @ApiOperation(value = "获取所有政治面貌")
    @GetMapping("/politicsstatus")
    public List<PoliticsStatus> getAllPoliticsStatus() {
        return politicsStatusService.list();
    }

    @ApiOperation(value = "获取所有民族")
    @GetMapping("/joblevels")
    public List<Joblevel> getAllJobLevels() {
        return joblevelService.list();
    }

    @ApiOperation(value = "获取所有民族")
    @GetMapping("/nations")
    public List<Nation> getAllNations() {
        return nationService.list();
    }

    @ApiOperation(value = "获取所有职位")
    @GetMapping("/positions")
    public List<Position> getAllPositions() {
        return positionService.list();
    }

    @ApiOperation(value = "获取所有部门")
    @GetMapping("/deps")
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @ApiOperation(value = "获取工号")
    @GetMapping("/maxworkid")
    public RespBean maxWorkId() {
        return employeeService.maxWorkId();
    }


    @ApiOperation(value = "添加员工")
    @PostMapping("/")
    public RespBean addEmp(@RequestBody Employee emp) {
        return employeeService.addEmp(emp);
    }

    @ApiOperation(value = "更新员工")
    @PutMapping("/")
    public RespBean updateEmp(@RequestBody Employee emp) {
        if (employeeService.updateById(emp)) {
            return RespBean.success("更新成功！");
        }
        return RespBean.error("更新失败！");
    }

    @ApiOperation(value = "删除员工")
    @DeleteMapping("/{id}")
    public RespBean deleteEmp(@PathVariable Integer id) {
        if (employeeService.removeById(id)) {
            return RespBean.success("删除成功！");
        }
        return RespBean.error("删除失败");
```

添加员工

开启rabbitMQ

```
#docker
#开启
docker start mySqlCentos
docker exec -it mySqlCentos /bin/bash

#启动rabbitMQ
systemctl start rabbitmq-server.service
#查看启动状态
systemctl status rabbitmq-server.service
```

```java
@ApiOperation(value = "添加员工")
    @PostMapping("/")
    public RespBean addEmp(@RequestBody Employee emp) {

        return employeeService.addEmp(emp);
    }
```



```java
  /**
     * 添加员工
     * @param emp
     * @return
     */
    @Override
    public RespBean addEmp(Employee emp) {
        //处理合同期限，保留两位小数
        LocalDate beginContract = emp.getBeginContract();
        LocalDate endContract = emp.getEndContract();
        long days = beginContract.until(endContract, ChronoUnit.DAYS);
        DecimalFormat df = new DecimalFormat("##.00");
        emp.setContractTerm(Double.parseDouble(df.format(days / 365.00)));
        if (1 == employeeMapper.insert(emp)) {
            Employee employee =  employeeMapper.getEmp(emp.getId()).get(0);

            //消息入库
            String msgId = UUID.randomUUID().toString();    //数据库记录发送的消息
//            String msgId = "123456";
            MailLog mailLog = new MailLog();
            mailLog.setMsgId(msgId);
            mailLog.setEid(employee.getId());
            mailLog.setStatus(0);
            mailLog.setRouteKey(MailConstants.MAIL_ROUTING_KEY);
            mailLog.setExchange(MailConstants.MAIL_EXCHANGE_NAME);
            mailLog.setCount(0);
            mailLog.setTryTime(LocalDateTime.now().plusMinutes(MailConstants.MSG_TIMEOUT));
            mailLog.setCreateTime(LocalDateTime.now());
            mailLog.setUpdateTime(LocalDateTime.now());

            mailLogMapper.insert(mailLog);      //消息落库



            //发送消息
            rabbitTemplate.convertAndSend(MailConstants.MAIL_EXCHANGE_NAME,MailConstants.MAIL_ROUTING_KEY, employee,new CorrelationData(msgId));
            return RespBean.success("添加成功！");
    }
        return RespBean.error("添加失败！");
    }
```

### 员工更新

```java
@ApiOperation(value = "更新员工")
    @PutMapping("/")
    public RespBean updateEmp(@RequestBody Employee emp) {
        if (employeeService.updateById(emp)) {
            return RespBean.success("更新成功！");
        }
        return RespBean.error("更新失败！");
    }
```

### 删除员工

```java
@ApiOperation(value = "删除员工")
    @DeleteMapping("/{id}")
    public RespBean deleteEmp(@PathVariable Integer id) {
        if (employeeService.removeById(id)) {
            return RespBean.success("删除成功！");
        }
        return RespBean.error("删除失败，没有该用户请核对");
    }
```



### 员工数据导入

重写name的Equals和HashCode，根据name的唯一性获取创建的对应的唯一对象，进而获取民族(对象)对应的id

```java
@Data
@NoArgsConstructor
@RequiredArgsConstructor//有参构造
@EqualsAndHashCode(callSuper = false,of = "name")//重写name的Equals和HashCode
@Accessors(chain = true)
@TableName("t_nation")
@ApiModel(value="Nation对象", description="")
public class Nation implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "id")
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @ApiModelProperty(value = "民族")
    @Excel(name="民族")
    @NonNull
    private String name;


}
```



```java
    @ApiOperation(value = "导入员工数据")
    @PostMapping("/import")
    public RespBean importEmp(MultipartFile file) {
        ImportParams params = new ImportParams();
        //去掉标题行
        params.setTitleRows(1);
        List<Nation> nationList = nationService.list();
        List<PoliticsStatus> politicsStatusList = politicsStatusService.list();
        List<Department> departmentList = departmentService.list();
        List<Joblevel> joblevelList = joblevelService.list();
        List<Position> positionList = positionService.list();
        try {
            List<Employee> excelData = ExcelImportUtil.importExcel(file.getInputStream(), Employee.class, params);
            excelData.forEach(emp ->{
                // 民族id
                emp.setNationId(nationList.get(nationList.indexOf(new Nation(emp.getNation().getName()))).getId());
                // 政治面貌
                emp.setPoliticId(politicsStatusList.get(politicsStatusList.indexOf(new PoliticsStatus(emp.getPoliticsStatus().getName()))).getId());
                // 部门
                emp.setDepartmentId(departmentList.get(departmentList.indexOf(new Department(emp.getDepartment().getName()))).getId());
                // 职称
                emp.setJobLevelId(joblevelList.get(joblevelList.indexOf(new Joblevel(emp.getJoblevel().getName()))).getId());
                // 职位
                emp.setPosId(positionList.get(positionList.indexOf(new Position(emp.getPosition().getName()))).getId());
            });

            if (employeeService.saveBatch(excelData)) {
                return RespBean.success("导入成功！");
            }

        } catch (Exception e) {
            e.printStackTrace();

        }
        return RespBean.error("导入失败！");
    }
```

```
new Nation(emp.getNation().getName()) 拿到nation对象（里面只存放了民族对应的name）
nationList.indexOf(new Nation(emp.getNation().getName())  获取对应下标
nationList.get(nationList.indexOf(new Nation(emp.getNation().getName())) 获取存放完整信息的nation对象

emp.setNationId(nationList.get(nationList.indexOf(new Nation(emp.getNation().getName()))).getId())  获取nation的id并在数据库里设置它的id值
```

导入准备的excel不能有空白行

### 员工导出

==工具EasyPOI==

修改pojo里员工类

```
@Excel(name = "最高学历")
@Excel(name = "最高学历", width=20)
@Excel(name = "转正日期", width = 20, format="yyyy-MM-dd")
@ExcelEntity(name = "职位")+@Excel(name = "职位")
```

@ExcelEntity标注为实体类，再通过@Excel(name = "职位")到实体类拿到所需字段

![image-20210730221337467](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210730221337467.png)

获取



```employeeService.getEmp(null)```:

```
@Override
public List<Employee> getEmp(Integer id) {
    return employeeMapper.getEmp(id);
}
```

```
#Mapper.JAVA
List<Employee> getEmp(Integer id);
```

```sql
 # EmployeeMapper.xml文件
 <select id="getEmp" resultMap="EmpInfo">
        SELECT
        e.*,
        n.id nid,
        n.NAME nname,
        p.id pid,
        p.NAME pname,
        d.id did,
        d.NAME dname,
        j.id jid,
        j.NAME jname,
        ps.id psid,
        ps.NAME psname
        FROM
        t_employee e,
        t_nation n,
        t_politics_status p,
        t_department d,
        t_joblevel j,
        t_position ps
        WHERE
        n.id = e.nationId
        AND d.id = e.departmentId
        AND j.id = e.jobLevelId
        AND ps.id = e.posId
        AND p.id = e.politicId
        AND n.id=e.nationId


        <if test="null!=id">
            and e.id =#{id}
        </if>
        order by
        e.id
    </select>
```



```java
@ApiOperation(value = "导出员工数据")
    @GetMapping(value = "/export", produces = "application/octet-stream")
    public void exportEmp(HttpServletResponse response) {
        List<Employee> list = employeeService.getEmp(null);
        ExportParams p = new ExportParams("员工表", "员工表", ExcelType.HSSF);
        Workbook workbook = ExcelExportUtil.exportExcel(p, Employee.class, list);
        ServletOutputStream out = null;

        try {
            response.setHeader("content-type", "application/octet-stream");
            response.setHeader("content-disposition", "attachment;filename=" + URLEncoder.encode("员工表.xls", "UTF-8"));
            out = response.getOutputStream();
            workbook.write(out);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (null != out) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
           }
        }
    }
```

## 发送邮件

rabbitmq 消息队列发送, 用途解耦，异步，削峰

### 依赖

```pom
<dependencies>
    <!-- rabbitmq 依赖-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    <!--邮件依赖-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <!--邮件模板依赖-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <!--server依赖-->
    <dependency>
      <groupId>com.song</groupId>
      <artifactId>yeb-server</artifactId>
      <version>0.0.1-SNAPSHOT</version>
    </dependency>
```

### 配置文件

```yml
server:
  #端口
  port: 8083
spring:
  # 邮件配置
  mail:
    # 邮件服务器地址
    host: smtp.163.com
    # 协议
    protocol: smtp
    # 编码格式
    default-encoding: utf-8
    # 授权码
    password: ZWFJHZUCJRZLVJWP
    # 发送者邮箱地址
    username: songfangt04@163.com
    # 端口 （不同邮箱端口号不同）
    port: 25

  redis:
    #
    timeout: 10000ms
    host: 47.96.76.101
    port: 6379
    database: 0
    lettuce:
      pool:
        max-active: 1024
        max-wait: 10000ms
        max-idle: 200
        min-idle: 5



  #rabbitmq   配置
  rabbitmq:
    username: guest
    password: guest
    host: localhost
    port: 5673
    listener:
      simple:
        acknowledge-mode: manual
```

### 邮件模板（基于thymeleaf）

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>入职欢迎邮件</title>
</head>
<body>
欢迎 <span th:text="${name}"></span> 加入 槭树环保 大家庭，您的入职信息如下：
<table border="1">
    <tr>
        <td>姓名</td>
        <td th:text="${name}"></td>
    </tr>
    <tr>
        <td>职位</td>
        <td th:text="${posName}"></td>
    </tr>
    <tr>
        <td>职称</td>
        <td th:text="${joblevelName}"></td>
    </tr>
    <tr>
        <td>部门</td>
        <td th:text="${departmentName}"></td>
    </tr>
</table>

<p>希望在未来的日子里，携手共进！</p>
</body>
</html>
```

### 发送邮件

发送邮件的内容比如employee一定Serializable接口

### 接收邮件

MailRecv

```java
@Component
public class MailRecv {


    private static final Logger LOGGER = LoggerFactory.getLogger(MailRecv.class);


    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private MailProperties mailProperties;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private RedisTemplate redisTemplate;

    @RabbitListener(queues = MailConstants.MAIL_QUEUE_NAME)
    public void handler(Message message, Channel channel) {
        Employee emp = (Employee) message.getPayload();
        MessageHeaders headers = message.getHeaders();
        // 消息序号
        long tag = (long) headers.get(AmqpHeaders.DELIVERY_TAG);
        // messageId
        String msgId = (String) headers.get("spring_returned_message_correlation");
        // 发件人
        HashOperations hashOperations = redisTemplate.opsForHash();

        try {
            if (hashOperations.entries("mail_log").containsKey(msgId)) {
                LOGGER.error("消息已经被消费=========》{}", msgId);
                /**
                 * 手动确认消息
                 * tag： 消息序号
                 * multiple 一次确认多条
                 */
                channel.basicAck(tag, false);
                return;
            }
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
            helper.setFrom(mailProperties.getUsername());
            // 收件人
            helper.setTo(emp.getEmail());
            helper.setSubject("入职欢迎邮件");
            helper.setSentDate(new Date());
            Context context = new Context();
            context.setVariable("name", emp.getName());
            context.setVariable("posName", emp.getPosition().getName());
            context.setVariable("joblevelName", emp.getJoblevel().getName());
            context.setVariable("departmentName", emp.getDepartment().getName());
            String mail = templateEngine.process("mail", context);
            helper.setText(mail, true);
            //发送邮件
            javaMailSender.send(mimeMessage);
            hashOperations.put("mail_log", msgId, "OK");
            LOGGER.info("消息已经被消费=========》{}", msgId);
            //手动确认一条消息
            channel.basicAck(tag, false);
        } catch (Exception e) {
            /**
             * requeue：是否退回队列
             */
            try {
                channel.basicNack(tag, false, true);
            } catch (IOException ioException) {
                LOGGER.error("邮件发送失败======》{}", e.getMessage());
            }
            LOGGER.error("邮件发送失败======》{}", e.getMessage());
        }
    }
}
```

### 消息的可靠性

考虑：保证生产端消息的可靠性投递（重复投递），消费者如何做到幂等性（一条消息重复多发）

消息成功发出

rabbitmq节点成功接收消息，并反馈给生产端

1.消息落库，对消息状态打标

![image-20210801165252547](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801165252547.png)

2.消息延迟投递，做二次确认，回调检查

![image-20210801171135485](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801171135485.png)

#### 实现过程

![image-20210801171208531](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801171208531.png)

##### 消息入库

```java
 			//消息入库
            String msgId = UUID.randomUUID().toString();    //数据库记录发送的消息,准备消息id
            //配置邮件发送日志,初始化MailLog表
            MailLog mailLog = new MailLog();
            mailLog.setMsgId(msgId);
            mailLog.setEid(employee.getId());
            mailLog.setStatus(0);
            mailLog.setRouteKey(MailConstants.MAIL_ROUTING_KEY);
            mailLog.setExchange(MailConstants.MAIL_EXCHANGE_NAME);
            mailLog.setCount(0);
            mailLog.setTryTime(LocalDateTime.now().plusMinutes(MailConstants.MSG_TIMEOUT));
            mailLog.setCreateTime(LocalDateTime.now());
            mailLog.setUpdateTime(LocalDateTime.now());

            mailLogMapper.insert(mailLog);      //消息落库
```

##### 发送消息

```java
            //发送消息
            rabbitTemplate.convertAndSend(MailConstants.MAIL_EXCHANGE_NAME,
                    MailConstants.MAIL_ROUTING_KEY, employee,new CorrelationData(msgId));
```

##### 接收消息

```


```

准备常量类

```java
public class MailConstants {
    /**
     * 消息投递中
     */
    public static final Integer DELIVERING = 0;

    /**
     * 消息投递成功
     */
    public static final Integer SUCCESS = 1;

    /**
     * 消息投递失败
     */
    public static final Integer FAILURE = 2;

    /**
     * 最大重试次数
     */
    public static final Integer MAX_TRY_COUNT = 3;

    /**
     *消息超时时间
     */
    public static final Integer MSG_TIMEOUT = 1;

    /**
     *队列名
     */
    public static final String MAIL_QUEUE_NAME = "mail.queue";

    /**
     *交换机名
     */
    public static final String MAIL_EXCHANGE_NAME = "mail.exchange";

    /**
     * 路由键
     */
    public static final String MAIL_ROUTING_KEY = "mail.routing.key";
}[]()
```

##### 配置rabbitmq

```java

/**
 * @program: yeb
 * @description: rabbitmq配置类
 * @author: Songfangteng
 * @create: 2021-07-30 21:42
 **/
@Configuration
public class RabbitMQConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMQConfig.class);

    @Autowired
    private IMailLogService mailLogService;

    @Autowired
    private CachingConnectionFactory cachingConnectionFactory;

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(cachingConnectionFactory);
        /**
         * 消息确认回调 确认消息是否到达 Broker
         * data : 消息唯一标识 ，就是 MSG UUID
         * eck ： 确认结果
         * cause :失败原因
         */
        rabbitTemplate.setConfirmCallback((data, ack, cause) -> {
            String msgId = data.getId();
            if (ack) {
                LOGGER.info("{}===========>消息发送成功",msgId);
                // 成功 更新数据库
                mailLogService.update(new UpdateWrapper<MailLog>().set("status", 1).eq("msgId", msgId));
            }else {
                LOGGER.error("{}====>消息发送失败", msgId);
            }


        });

        /**
         * 消息发送失败回调，比如router 不到queue 回调
         * msg: 消息主题
         * repcode: 响应码
         * repText: 相应描述
         * exchange:    交换机
         * routingkey:  路由键
         */
        rabbitTemplate.setReturnCallback((msg,repcode,repText,exchange,routingkey)->{
            LOGGER.error("{}=======>消息发送queue时失败", msg.getBody());
        });



        return rabbitTemplate;
    }


    @Bean
    public Queue queue() {
        return new Queue(MailConstants.MAIL_QUEUE_NAME);
    }


    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange(MailConstants.MAIL_EXCHANGE_NAME);
    }


    @Bean
    public Binding binding() {
        return BindingBuilder.bind(queue()).to(directExchange()).with(MailConstants.MAIL_ROUTING_KEY);
    }
}

```

##### 邮件定时发送

```java
public class MialTask {
    /**
     * 邮件发送任务 5s一次
     */


    @Autowired
    private IMailLogService mailLogService;

    @Autowired
    private IEmployeeService employeeService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Scheduled(cron = "0 5 * * * ?")
    public void mailTask() {
        List<MailLog> mailLogList = mailLogService.list(new QueryWrapper<MailLog>().eq("status", 0).lt("tryTime", LocalDateTime.now()));
        mailLogList.forEach(mailLog -> {
            // 如果重试次数超过三次，更新状态为投递失败，不在重试
            if (3 <= mailLog.getCount()) {
                mailLogService.update(new UpdateWrapper<MailLog>().set("status", 2).eq("msgId", mailLog.getMsgId()));
            }
            mailLogService.update(new UpdateWrapper<MailLog>()
                    .set("count", mailLog.getCount() + 1)
                    .set("updateTime", LocalDateTime.now())
                    .set("tryTime", LocalDateTime.now().plusMinutes(MailConstants.MSG_TIMEOUT)));
            Employee employee = employeeService.getEmp(mailLog.getEid()).get(0);
            rabbitTemplate.convertAndSend(MailConstants.MAIL_EXCHANGE_NAME, MailConstants.MAIL_ROUTING_KEY,
                    employee, new CorrelationData(mailLog.getMsgId()));
        });

    }
}
```

##### 消费端幂等性操作

消息的重复投递后，消费者如何保证消息的正确执行，或者说只消费一次

唯一ID+指纹码  方法：给入库的方法添加ID，再有消息要入库时，我要校验消息的ID，数据库里是否存在，则证明是存过的同一个消息存在则拒绝入库

具体方案：

使用缓存， 将msgId存入到redis，每次消费消息之前，进入redis查询，有这个id，说明该消息已经被消费过，就不再消费，没有则证明是新消息，存入它的msgID， 消费消息。

```java
//通过消息获取员工类
        Employee emp = (Employee) message.getPayload();
        //消息序号放在headers里
        MessageHeaders headers = message.getHeaders();
        // 消息序号
        long tag = (long) headers.get(AmqpHeaders.DELIVERY_TAG);
        // messageId ，获取消息的ID
        String msgId = (String) headers.get("spring_returned_message_correlation");
        // msgId作为hash的key
        HashOperations hashOperations = redisTemplate.opsForHash();
		try {
            //查询msgId是否被包含
            if (hashOperations.entries("mail_log").containsKey(msgId)) {
                LOGGER.error("消息已经被消费=========》{}", msgId);
                /**
                 * 手动确认消息
                 * tag： 消息序号
                 * multiple 一次确认多条
                 */
                channel.basicAck(tag, false);
                return;
            }
            javaMailSender.send(mimeMessage);
            LOGGER.info("邮件发送成功");

            //将消息ID存入redis
            hashOperations.put("mail_log", msgId, "OK");
            LOGGER.info("消息已经被消费=========》{}", msgId);
            //手动确认一条消息
            channel.basicAck(tag, false);
        } catch (Exception e) {
            /**
             * requeue（b1）：是否退回队列
             */
            try {
                channel.basicNack(tag, false, true);
            } catch (IOException ioException) {
                LOGGER.error("邮件发送失败======》{}", e.getMessage());
            }
            LOGGER.error("邮件发送失败======》{}", e.getMessage());
        }
```

## 工资账套

基于mybatisPlus

```java
package com.song.server.controller;


/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author songfangteng
 * @since 2021-07-29
 */
@RestController
@RequestMapping("/salary/sob")
public class SalaryController {
    @Autowired
    private ISalaryService salaryService;

    @ApiOperation("获取所有工资账套")
    @GetMapping("/")
    public List<Salary> getAllSalaries() {
        return salaryService.list();
    }

    @ApiOperation("添加工资账套")
    @PostMapping("/")
    public RespBean addSalary(@RequestBody Salary salary) {
        //创建日期
        salary.setCreateDate(LocalDateTime.now());
        if (salaryService.save(salary)) {
            return RespBean.success("添加成功！");
        }
        return RespBean.error("添加失败！");
    }

    @ApiOperation("删除工资账套")
    @DeleteMapping("/{id}")//需要传参
    public RespBean deleteSalary(@PathVariable Integer id) {
        if (salaryService.removeById(id)) {
            return RespBean.success("删除成功！");
        }
        return RespBean.error("删除失败！");
    }

    @ApiOperation("更新工资账套")
    @PutMapping("/")
    public RespBean updateSalary(@RequestBody Salary salary) {
        if (salaryService.updateById(salary)) {
            return RespBean.success("更新成功！");
        }
        return RespBean.error("删除失败！");
    }
}

```

## 员工工资账套设置

外键查询 查询当前所有员工有的工资账套 员工账套表+工资账套

每一个 员工的工资账套都是唯一的

controller

```java
@RestController
@RequestMapping("/salary/sobcfg")
public class SalarySobCfgController {
    @Autowired
    private ISalaryService salaryService;

    @Autowired
    private IEmployeeService employeeService;

    @ApiOperation("获取所有工资账套")
    @GetMapping("/salaries")
    public List<Salary> getAllSalaries() {
        return salaryService.list();
    }

    @ApiOperation("获取所有员工账套")
    @GetMapping("/")
    public RespPageBean getEmpWithSalary(@RequestParam(defaultValue = "1") Integer currentPage,
                                         @RequestParam(defaultValue = "10") Integer size) {
        return employeeService.getEmpWithSalary(currentPage, size);
    }

    @ApiOperation("更新员工账套")
    @PutMapping("/")
    public RespBean updateEmpSalary(Integer eid, Integer sid) {
        if (employeeService.update(new UpdateWrapper<Employee>().set("salaryid", sid).eq("id", eid))) {
            return RespBean.success("更新成功！");
        }
        return RespBean.error("更新失败！");
    }
}

```

## 在线聊天

### WebSocket

![image-20210801214545369](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801214545369.png)

与HTTP数据传输协议对比，服务器端可以主动和客户端发送消息，而不需要客户端的请求。全双工通信

![image-20210801214619370](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801214619370.png)

###### 依赖

```pom
    <!-- Websocket 依赖-->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
  </dependencies>
```

###### 配置类

```java
/**
 * @program: yeb
 * @description: WebSocket配置类
 * @author: Songfangteng
 * @create: 2021-08-01 21:51
 **/
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Value("${jwt.tokenHead}")
    private String tokenHead;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;
    /**
     * 添加这个Endpoint，这样在网页中可以通过 websocket 连接上服务器
     * 也就是我们配置websocket 的服务地址，并且可以指定是否使用 socketJS
     *
     * @param registry
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        /**
         * addEndpoint: 将  /ws/ep 路径注册为stomp 的端点，用户连接了这个端点就可以进行websocket通讯，支持socketJS
         * setAllowedOrigins: 允许跨域
         * withSockJS : 支持socketJs 访问
         */
        registry.addEndpoint("/ws/ep").setAllowedOrigins("*").withSockJS();
    }

    /**
     *  输入通道参数 配置（JWT令牌相关）
     * @param registration
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                // 判断是否为连接， 如果是，需要获取token 并设置用户对象
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String token = accessor.getFirstNativeHeader("Auth-Token");
                    if (!StringUtils.isEmpty(token)) {
                        String authToken = token.substring(tokenHead.length());
                        String username = jwtTokenUtil.getUsernameFromToken(authToken);
                        // token 中存在 用户名
                        if (!StringUtils.isEmpty(username)) {
                            //登录
                            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                            if (jwtTokenUtil.validateToken(authToken, userDetails)) {
                                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                                accessor.setUser(authenticationToken);
                            }

                        }
                    }

                }
                return message;
            }
        });
    }

    /**
     *  配置消息代理
     * @param registry
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 配置代理域，可以配置多个，配置代理目的地为前缀  /queue ，可以在配置域上向客户端推送消息
        registry.enableSimpleBroker("/queue");
    }
}

```

前端向后端推送消息

![image-20210801215751976](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801215751976.png)

后端向前端推送

![image-20210801215843192](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801215843192.png)

如果使用JWT令牌配置了拦截器，客户端找服务端的时候会被登录拦截器拦截，因此需要给客户端的请求JWT令牌，使其正常通过，使用输入管道的配置

![image-20210801220654965](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801220654965.png)

去登录拦截器放行websocket

![image-20210801221550720](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210801221550720.png)

创建聊天类的封装

```java
/**
 * @program: yeb
 * @description: websocket
 * @author: Songfangteng
 * @create: 2021-04-01 22:12
 **/
@Controller//@MessageMapping 不是restfu风格，用@Controller
public class WsController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;


    @MessageMapping("/ws/chat")
    public void handleMsg(Authentication authentication, ChatMsg chatMsg) {
        Admin admin = (Admin) authentication.getPrincipal();
        //当前用户
        chatMsg.setFrom(admin.getUsername());
        chatMsg.setFromNickName(admin.getName());
        chatMsg.setDate(LocalDateTime.now());
        //发送消息
        simpMessagingTemplate.convertAndSendToUser(chatMsg.getTo(), "/queue/chat", chatMsg);
    }
}
```

```
<div>
          <el-button icon="el-icon-bell" type="text"></el-button>
          <el-dropdown class="userInfo" @command="handleCommand">
          <span class="el-dropdown-link">
<!--            {{ this.$store.state.user.name }}<i> <img :src="this.$store.state.user.userFace"></i>-->
            {{ user.name }}<i> <img :src="user.userFace"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
```

前端需要查询和谁聊天

ChatController

```java
/**
 * @program: yeb
 * @description: 在线聊天
 * @author: Songfangteng
 * @create: 2021-04-01 22:17
 **/
@RestController
@RequestMapping("/chat")
public class ChatController {
    @Autowired
    private IAdminService adminService;

    @ApiOperation("获取所有操作员")
    @GetMapping("/admin")
    public List<Admin> getAllAdmins(String keywords) {
        return adminService.getAllAdmins(keywords);
    }
}
```

​		前端配置后，后端报错

报错信息 `When allowCredentials is true, allowedOrigins cannot contain the special value "*“since that cannot be set on the “Access-Control-Allow-Origin” response header. To allow credentials to a set of origins, list them explicitly or consider using"allowedOriginPatterns” instead`

解决办法：跨域配置报错，将`.setAllowedOrigins`替换成`.setAllowedOriginPatterns即可。

![image-20210802102409983](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210802102409983.png)

Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImNyZWF0ZWQiOjE2Mjc1NTg1ODY1ODEsImV4cCI6MTYyODE2MzM4Nn0.409g9SBTHOyIqTZ_ixBqzGuezeA-C63oLzgpxeIviHIZp1_VKWtvepI5dpeTZv30K_xghG-mZFIvjghvXqhDlA

![image-20210802171848305](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210802171848305.png)

# 个人中心

报错400 ，调式参数不符合json格式

controller

```java
@RestController
public class AdminInfoController {
    @Autowired
    private IAdminService adminService;
    @ApiOperation("更新当前用户信息")
    @PutMapping("/admin/info")
    public RespBean updateAdmin(@RequestBody Admin admin, Authentication authentication){
        if(adminService.updateById(admin)){
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(admin,
                    null, authentication.getAuthorities()));
            return RespBean.success("用户信息更新成功");

        }
        return RespBean.error("更新失败");
    }
    @ApiOperation("更新用户密码")
    @PutMapping("/admin/pass")
    public RespBean updateAdminPassword(@RequestBody Map<String,Object> info){
        String oldPass = (String) info.get("oldPass");
        String pass = (String) info.get("pass");
        Integer adminId = (Integer) info.get("adminId");
        return adminService.updateAdminPassword(oldPass, pass, adminId);
    }
}

```

## 更新密码

adminService.updateAdminPassword 方法

接口

```java
RespBean updateAdminPassword(String oldPass, String pass, Integer adminId);
```

实现方法

```java
 @Override
    public RespBean updateAdminPassword(String oldPass, String pass, Integer adminId) {
        Admin admin = adminMapper.selectById(adminId);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        //判断输入旧密码是否一致
        if(encoder.matches(oldPass, admin.getPassword())){
            //更新密码
            admin.setPassword(encoder.encode(pass));
            int result = adminMapper.updateById(admin);
            if(1==result){
                return RespBean.success("密码更新成功");
            }
        }
        return RespBean.error("密码更新失败");
    }
```

authority的JSON反序列化J失败

编写反序列化类

```java
public class CustomAuthorityDeserializer extends JsonDeserializer {

    @Override
    @JsonDeserialize(using = CustomAuthorityDeserializer.class)
    public Object deserialize(JsonParser p, DeserializationContext deserializationContext) throws IOException,
            JsonProcessingException {
        ObjectMapper mapper = (ObjectMapper) p.getCodec();
        JsonNode jsonNode = mapper.readTree(p);
        List<GrantedAuthority> grantedAuthorities = new LinkedList<>();

        Iterator<JsonNode> elements = jsonNode.elements();
        while (elements.hasNext()) {

            JsonNode next = elements.next();
            JsonNode authority = next.get("authority");
            grantedAuthorities.add(new SimpleGrantedAuthority(authority.asText()));
        }
        return grantedAuthorities;
    }
}

```

admin类里添加注解

![image-20210802201604518](https://gitee.com/dreamlover521/typora-table/raw/master/image-20210802201604518.png)