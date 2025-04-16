using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Server.DataAccess.Repository.Abstraction
{
    public interface IRepository<T> where T : class
    {
        public Task<IEnumerable<T>> GetAll(Expression<Func<T, bool>>? whereClause = null, string? includeProperties = null);
        public Task<T?> Get(Expression<Func<T, bool>>? whereClause = null, string? includeProperties = null, bool tracked = false);
        void Add(T entity);
        void Delete(T entity);
    }
}
